const Dockerode = require("dockerode");
const fs = require("fs");

const docker = new Dockerode();

function nodeRunner(fn, code){
    docker.createContainer({
        Tty: true,
        Image: 'example',
        Cmd: ["sh"],
        HostConfig: {
            NetworkMode: 'none',
            AutoRemove: true,
        }
    }, 
    (err, cont)=>{
        if (err) console.error(err);

       cont.start((err)=>{


        cont.exec({Cmd: ["sh", "start.sh", fn + ".js", code], AttachStderr: true, AttachStdout: true}, (err, exec) =>{
            if (err) console.error(err); 
            exec.start();
        });
    
    
        cont.exec({Cmd: ["jest", fn + ".test.js"], AttachStderr: true, AttachStdout: true}, (err, exec) =>{
            exec.start({hijack: true, stdin: true, stdout: true},(err, stream)=>{
                docker.modem.demuxStream(stream, process.stdout, process.stderr);
                var res = ""; 
                stream.on("data", (data)=>{
                    res = res + data.toString(); 
                })
                
                stream.on("end", ()=>{
                    console.log("!!!!!!!!",res, "ended")
                    cont.stop()
                })
            });
       });
    
       }); 

      
    });

    
}; 






module.exports = nodeRunner;