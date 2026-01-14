import ping from "ping";
import { Client } from "ssh2";
import { readFileSync } from "fs";
import dotenv from 'dotenv';

dotenv.config();

async function isRouterAlive(host) {
    const res = await ping.promise.probe(host,{
        timeout:2
    });
    // console.log(res)
    return res.alive;
  }

// function pushConfig(router, commands) {
//   return new Promise((resolve, reject) => {
//     console.log(`Trying to enter ${router.name}`);

//     const conn = new Client();
//     let output = "";
//     let username='';
//     let password='';

//     conn.on("ready", () => {
//       console.log(`Connection Established ${router.name}`)
//       conn.shell((err, stream) => {
//         if (err) return reject(err);

//         let i = 0;
//         const sendNext = () => {
//           if (i < commands.length) {
//             stream.write(commands[i] + "\n");
//             i++;
//             setTimeout(sendNext, 800); 
//           } else {

//             setTimeout(() => {
//               stream.write("exit\n");
//             }, 2000);
//           }
//         };

//         sendNext();

//         stream.on("data", data => {
//           const text = data.toString();
//           output += text;
//           process.stdout.write(text);         
          
//         });

//         stream.on("close", () => {
//           conn.end();
//           resolve({ router: router.name, output });
//         });
//       });
//     });

//     conn.on("error", reject);

//     if(router.authType ==='acs'){
//         username= process.env.ACS_USER
//         password= process.env.ACS_PASS
//     }
//     else{
//         username= process.env.LOCAL_USER
//         password= process.env.LOCAL_PASS        
//     }
//     conn.connect({
//         host: router.host,
//         username: username,
//         password: password,
//         readyTimeout: 20000,
      
//         algorithms: {
//           kex: [
//             "diffie-hellman-group14-sha1",
//             "diffie-hellman-group1-sha1"
//           ],
//           cipher: [
//             "aes128-cbc",
//             "aes256-cbc",
//             "aes128-ctr",
//             "aes256-ctr"
//           ],
//           serverHostKey: [
//             "ssh-rsa"
//           ]
//         }
//       });    

//   });
// }


function pushConfig(router, commands) {
    return new Promise((resolve, reject) => {
      console.log(`🔐 Trying to enter ${router.name}`);
  
      const conn = new Client();
      let output = "";
      let index = 0;
      let streamRef;
  
      conn.on("ready", () => {
        console.log(`✅ Connection Established: ${router.name}`);
  
        conn.shell((err, stream) => {
          if (err) return reject(err);
          streamRef = stream;
  
          const send = () => {
            if (index < commands.length) {
              const cmd = commands[index];
            //   console.log(`➡️ ${router.name}: ${cmd}`);
              stream.write(cmd + "\n");
            } else {
              setTimeout(() => {
                stream.write("exit\n");
              }, 500);
            }
          };
  
          send();
  
          stream.on("data", data => {
            const text = data.toString();
            output += text;
            process.stdout.write(text);
  
            // ✅ PING COMPLETED → move to NEXT command
            if (text.includes("Success rate")) {
              index++;
              stream.write("\n"); // flush Cisco prompt
              setTimeout(send, 300);
              return;
            }
  
            // ✅ NON-PING command completed (prompt)
            if (
              text.trim().endsWith("#") &&
              !commands[index]?.startsWith("ping")
            ) {
              index++;
              setTimeout(send, 200);
            }
          });
  
          stream.on("close", () => {
            conn.end();
            resolve({ router: router.name, output });
          });
        });
      });
  
      conn.on("error", reject);
  
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

const routersJson = readFileSync('routers.json', "utf8");
const parsedRouters= JSON.parse(routersJson)
const routers=parsedRouters.routers
console.log(routers)


// const commands = [
//   "terminal length 0",
//   "show int des"
// ];

;(async () => {
  for (const router of routers) {

    const commands = [
        "terminal length 0",
        `ping ${router.isp1Dest} source ${router.isp1Source} repeat 2 timeout 1`,
        `ping ${router.isp2Dest} source ${router.isp2Source} repeat 2 timeout 1`
      ];    
    // console.log(`\n🔍 Pinging ${router.name} (${router.host})`);

    const alive = await isRouterAlive(router.host);
  
    if (!alive) {
      console.log(`❌ ${router.name} is DOWN (ping failed)`);
      continue;
    }
  
    console.log(`✅ ${router.name} is UP, connecting...`);    

    try {
      console.log(`\n Configuring ${router.name}`);
      const result = await pushConfig(router, commands);
    //   console.log("\n--- COMMAND OUTPUT STORED ---");
    //   console.log(result.output);
      console.log(`${router.name} Connection Closed`);
    } catch (err) {
      console.error(` ${router.name} failed:`, err.message);
    }
  }
})();