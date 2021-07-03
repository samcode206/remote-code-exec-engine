const Dockerode = require("dockerode");


const docker = new Dockerode();

const getConfig = () => ({
        Tty: true,
        Image: 'example',
        Cmd: ["sh"],
        HostConfig: {
            NetworkMode: 'none',
            AutoRemove: true,
            Memory: 100000000,
            Privileged: false,
            MemoryReservation: 7000000,
            CpuQuota: 1000000,
        }
    }
);



function nodeRunner(fn, code, cb){
    docker.createContainer(getConfig(), (err, cont)=>{
        if (err) cb(null,err);

       cont.start((err)=>{
        if (err) cb(null,err);

            cont.exec({Cmd: ["sh", "start.sh", fn + ".js", code], AttachStderr: true, AttachStdout: true}, (err, exec) =>{
                if (err) cb(null,err)
                exec.start();
            });
    

            cont.exec({Cmd: ["jest", fn + ".test.js"], AttachStderr: true, AttachStdout: true}, (err, exec) =>{
                    exec.start({stdin: true, stdout: true},(err, stream)=>{
                    // docker.modem.demuxStream(stream, process.stdout, process.stderr);

                        setTimeout(() => {
                            cont.inspect((err, stats)=>{
                                if (stats.State.Running === true) {
                                    if (!res.length){
                                        cb(null, "timeout");
                                    }
                                    cont.stop();
                                }
                            })
                        }, 5000);


                        let res = ""; 
                            stream.on("data", (data)=>{
                                res = res + data.toString(); 
                            })
                            
                            stream.on("end", ()=>{
                                cb(res, null);
                                cont.inspect((err, stats)=>{
                                    if (stats.State.Running === true) cont.stop();
                                })
                            })
                });
            });
    
       }); 
  
    });

}; 



module.exports = nodeRunner;