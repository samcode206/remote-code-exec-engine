import Dockerode from "dockerode";


const docker = new Dockerode();

const getConfig = () => ({
        Tty: true,
        Image: 'node-runner',
        Cmd: ["sh"],
        HostConfig: {
            NetworkMode: 'none',
            AutoRemove: true,
            Memory: 100000000,
            Privileged: false,
            MemoryReservation: 7000000,
            CpuQuota: 1000000,
        },
    }
);

const writeScript = (fn : string, code : string) => ({Cmd: ["sh", "start.sh", fn + ".js", code], AttachStderr: true, AttachStdout: true});
const runTests = (fn : string) => ({Cmd: ["jest", fn + ".test.js"], AttachStderr: true, AttachStdout: true});



async function nodeRunner(fn :string, code: string, cb: any){
    let res = ""; 
   
    const container = await docker.createContainer(getConfig());
    console.log("created container at ", Date.now() / 1000);
    await container.start();

    console.log("started container at ", Date.now() / 1000);
    await (await container.exec(writeScript(fn, code))).start({});
    console.log("wrote to container at ", Date.now() / 1000);
    const stream = await (await container.exec(runTests(fn))).start({});
    console.log("started tests at ", Date.now() / 1000);

    stream.on("data", (data)=>{
        res = res + data.toString(); 
    });

    stream.on("end", ()=>{
        console.log("ended at ", Date.now() / 1000);
        cb(res, null);
        container.inspect((err, stats)=>{
            if (err) cb(null,err);
            if (stats?.State.Running === true) container.stop();
        });
    });

}; 

export default nodeRunner;
