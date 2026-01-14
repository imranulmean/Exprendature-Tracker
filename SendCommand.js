import { Client } from "ssh2";

function pushConfig(router, commands) {
    return new Promise((resolve, reject) => {
      console.log(`entering to the ${router.name}`)
      const conn = new Client();
      let output = "";
  
      conn.on("ready", () => {
        conn.shell((err, stream) => {
          if (err) return reject(err);
  
          let i = 0;
  
          const sendNext = () => {
            if (i < commands.length) {
              stream.write(commands[i] + "\n");
              i++;
              setTimeout(sendNext, 400); 
            } else {
                stream.write("end\n");
              setTimeout(() => {
                stream.write("exit\n");
              }, 500);              
            }
          };
  
          sendNext();
  
          stream.on("data", data => {
            output += data.toString();            
          });
  
          stream.on("close", () => {
            conn.end();
            resolve({ router: router.name, output });
          });
        });
      });
  
      conn.on("error", reject);
  
      conn.connect({
        host: router.host,
        username: router.username,
        password: router.password,
        readyTimeout: 20000
      });
    });
  }

  const routers = [
    // { host: "10.137.24.1", name: "Panchaboti Sub", username: "aibladmin", password: "C1sc0@786" },
    { host: "10.137.14.193", name: "Nikunjo Sub", username: "aibladmin1212", password: "C1sc0@786" },
  ];
  
  const commands = [
    "terminal length 0",
    "conf ter",
    "ip prefix-list dc-in seq 87 permit 10.253.34.0/24"
  ];
  
  // Sequential = safest for config
  for (const router of routers) {
    try {
      console.log(`\n🚀 Configuring ${router.name}`);
      const result = await pushConfig(router, commands);
      console.log(result)
      console.log(`✅ ${router.name} done`);
    } catch (err) {
      console.error(`❌ ${router.name} failed:`, err.message);
    }
  }