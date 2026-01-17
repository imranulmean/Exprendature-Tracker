import ping from "ping";
import { Client } from "ssh2";
import XLSX from "xlsx";
import fs from "fs";
import dotenv from 'dotenv';
import moment from 'moment';

dotenv.config();

function exportToExcel(finalResult) {
    const rows = finalResult.map(item => {
      const r = item.result; 
  
      return {
        branchId: r?.branchId || "", 
        name: r?.router || "",
        host: r?.host || "",
        isp1Name: r?.results?.isp1?.name || "",
        isp1Status: r?.results?.isp1?.status || "UNKNOWN",
        isp2Name: r?.results?.isp2?.name || "",
        isp2Status: r?.results?.isp2?.status || "UNKNOWN",
        error: r?.results?.error || "OK",
        routerType: r?.routerType || "UNKNOWN"
      };
    });
  
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
  
    XLSX.utils.book_append_sheet(workbook, worksheet, "ISP Status");
  
    XLSX.writeFile(workbook, "isp_status.xlsx");
  
    console.log("✅ Excel file created: isp_status.xlsx");
  }

async function isRouterAlive(host) {
    const res = await ping.promise.probe(host,{
        timeout:2
    });
    // console.log(res)
    return res.alive;
  }


function pushConfig(router, commands) {
    return new Promise((resolve, reject) => {
      console.log(`🔐 Trying to enter ${router.name}`);    
    
      const conn = new Client();
      let output = "";
      let index = 0;
      let ispIndex = 1;
      let streamRef;
      const result = {
        branchId: router.branchId,
        router: router.name,
        host: router.host,
        results: {},
        routerType: router.routerType
      };     

      conn.on("ready", () => {
        console.log(`✅ Connection Established: ${router.name}`);
  
        conn.shell((err, stream) => {
          if (err) return reject(err);
          streamRef = stream;
  
          const send = () => {
            if (index < commands.length) {
              const cmd = commands[index];
              stream.write(cmd + "\n");
            }
          };
  
          send();
  
          stream.on("data", data => {
            const text = data.toString();
            output += text;
            process.stdout.write(text);
  
            // AUTHORIZATION FAILED         
            if (text.includes("% Authorization failed")) {
              console.log(`Authorization failed on ${router.name}. Skipping router.`);

              result.results = {
                error: "AUTHORIZATION_FAILED"
              };

              stream.end(); 
              return;
            }
            // PING COMPLETED → move to NEXT command
            if (text.includes("Success rate")) {
              const match = text.match(/Success rate is (\d+) percent/);
              const percent = match ? Number(match[1]) : 0;            
              const isUp = percent > 0;
              result.results[`isp${ispIndex}`] = {
                name: router[`isp${ispIndex}Name`],
                dest: router[`isp${ispIndex}Dest`],
                source: router[`isp${ispIndex}Source`],
                status: isUp ? "UP" : "DOWN"
              };
              index++;
              ispIndex++;
              stream.write("\n"); 
              setTimeout(send, 300);
              return;
            }
  
            // NON-PING command completed (prompt)
            if ( text.trim().endsWith("#") && !commands[index]?.startsWith("ping") ) {
              index++;
              setTimeout(send, 200);
            }
          });
  
          stream.on("close", () => {
            conn.end();
            resolve({ result });
          });
        });
      });
  
      // conn.on("error", reject);
      conn.on("error", err => {
        resolve(
          result.results = {
            error: err.message
          }
        );
      })      
  
      const username =
        router.authType === "acs"
          ? process.env.ACS_USER
          : process.env.LOCAL_USER;
  
      const password =
        router.authType === "acs"
          ? process.env.ACS_PASS
          : process.env.LOCAL_PASS;
  
      conn.connect({
        host: router.host,
        username,
        password,
        readyTimeout: 20000,
        algorithms: {
          kex: [
            "diffie-hellman-group14-sha1",
            "diffie-hellman-group1-sha1"
          ],
          cipher: [
            "aes128-cbc",
            "aes256-cbc",
            "aes128-ctr",
            "aes256-ctr"
          ],
          serverHostKey: ["ssh-rsa"]
        }
      });
    });
  }

async function mikrotikConfig(router, commands) {
    console.log(`🔐 Trying to enter ${router.name}`);
  
    const result = {
      branchId: router.branchId,
      router: router.name,
      host: router.host,
      results: {},
      routerType: router.routerType
    };
  
    /* ==============================
        MIKROTIK (NO SSH)
       ============================== */
      const isp1Alive = await isRouterAlive(router.isp1Source);
      const isp2Alive = await isRouterAlive(router.isp2Source);
  
      result.results.isp1 = {
        name: router.isp1Name,
        dest: router.isp1Dest,
        source: router.isp1Source,
        status: isp1Alive ? "UP" : "DOWN"
      };
  
      result.results.isp2 = {
        name: router.isp2Name,
        dest: router.isp2Dest,
        source: router.isp2Source,
        status: isp2Alive ? "UP" : "DOWN"
      };
  
      return { result };

}    

async function processRouter(router) {
    const commands = [
      "terminal length 0",
      `ping ${router.isp1Dest} source ${router.isp1Source} repeat 2 timeout 1`,
      `ping ${router.isp2Dest} source ${router.isp2Source} repeat 2 timeout 1`,
      "exit"
    ];
  
    const alive = await isRouterAlive(router.host);
    let result ={
      branchId: router.branchId,
      router: router.name,
      host: router.host,
      routerType: router.routerType,
      results:{}
    };
  
    if (!alive) {
      console.log(`❌ ${router.name} is DOWN (ping failed)`);
  
      result.results={
        isp1: {
          name: router.isp1Name,
          dest: router.isp1Dest,
          source: router.isp1Source,
          status: "DOWN"
        },
        isp2: {
          name: router.isp2Name,
          dest: router.isp2Dest,
          source: router.isp2Source,
          status: "DOWN"
        }
      }
  
      return { result };
    }
  
    console.log(`✅ ${router.name} is UP, connecting...`);
  
    try {
      console.log(`\n Configuring ${router.name}`);
  
      if (router?.mikrotik === "yes") {
        result = await mikrotikConfig(router, commands);
      } else {
        result = await pushConfig(router, commands);
      }
  
      console.log(`${router.name} Connection Closed`);
      return result;
    } catch (err) {
      console.error(`${router.name} failed:`, err.message);
      result.results = {
        error: err.message
      };    
      return { result };
    }
  }

  async function runWithConcurrency(items, limit, worker) {
    const results = [];
    let index = 0;
  
    async function next() {
      if (index >= items.length) return;
      const current = index++;
      const res = await worker(items[current]);
      if (res) results.push(res);
      await next();
    }
  
    const workers = Array.from({ length: limit }, next);
    await Promise.all(workers);
  
    return results;
  }

  async function main(){
    console.log('------------------Running Again--------------------')
    running=true;
    const CONCURRENCY = 15; // safe for 500 routers
    const results = await runWithConcurrency(routers, CONCURRENCY, processRouter);  
    finalResult.push(...results);      
    fs.writeFileSync('FinalResult.json',JSON.stringify(finalResult, null, 1));
    console.log(`Result Written in FinalResult.json File`)
    exportToExcel(finalResult);
    running=false;
  }

  function timeTest(){
    const now = moment();
    const parsedNow = now.format('MMMM Do YYYY, h:mm:ss a')
    console.log(parsedNow);
    // Check if Time is before 10 am or after 6 pm
    const tenAM = moment().hour(10).minute(0).second(0);
    const sixPM = moment().hour(18).minute(0).second(0);    
    // Checks
    const isAfter10AM = now.isAfter(tenAM);   // 10:01 AM → true
    const isAfter6PM = now.isAfter(sixPM);    // 6:01 PM → true
    
    console.log(isAfter10AM, isAfter6PM);    
    ///////////////////////////
    const prev = moment("January 17th 2026, 10:33:00 am", "MMMM Do YYYY, h:mm:ss a");
    const duration = moment.duration(now.diff(prev));
    const hours = Math.floor(duration.asHours());
    const minutes = duration.minutes();
    const diffFormatted = `${hours} hr : ${minutes.toString().padStart(2, '0')} min`;  
    console.log(diffFormatted);
  }
  

  let running=false;
  const finalResult=[];
  const routersJson = fs.readFileSync('routers.json', "utf8");
  // const routersJson = fs.readFileSync('newRouter.json', "utf8");
  const parsedRouters= JSON.parse(routersJson)
  const routers=parsedRouters.routers;

  // main();
  timeTest();

  setInterval(()=>{
    // First Check if today file exists or not. if no then create the file with today date DD/MM/YYYY.json. then Read from this file
    const today = moment();
    const formatToday=today.format('DD-MM-YYYY')
    if( !running && !fs.existsSync(`${formatToday}.json`)){
      console.log(`Creating File ${formatToday}.json`)
      const finalRouters= routers.map(rt=>{
        let obj={
          result:{
            branchId:rt.branchId,
            router:rt.name,
            host:rt.host,
            routerType:rt.routerType,
            results:{
              isp1:{
                "name":rt.isp1Name,
                "dest":rt.isp1Dest,
                "source":rt.isp1Source,
                "prevStatus":"UP",
                "status": "UP",
                "downTimes":[],
                "upTimes":[],
                "totalDownTime":""
              },
              "isp2": {
                "name":rt.isp2Name,
                "dest":rt.isp2Dest,
                "source":rt.isp2Source,
                "prevStatus":"UP",
                "status":"UP",
                "downTimes":[],
                "upTimes":[],
                "totalDownTime":""
              }          
            }
          }
        }
        return obj;
      })
      const jsonObj={routers: finalRouters}
      const finatRoutersJSON= fs.writeFileSync(`${formatToday}.json`, JSON.stringify(jsonObj, null, 1));
    }
    else{
      if(!running){
        main()
      }
    }

    // timeTest();
  },1000 * 1)

  
