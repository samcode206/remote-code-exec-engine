import Runner from "../../core/Runner";
import Container from "../../core/Docker";

export default class Python3 extends Runner {
    private config = {
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
    };

    private fileExt : string = ".py"; 
    constructor(code: string, problem : string, numArgs : number){
        super(code, problem, numArgs)
    };

    sandbox(code : string, problemName : string, numArgs : number): string {
        return code;
    };

   async run(cb : any){
        const nodeContainer = new Container(this.config);

        // creates the container with given settings 
        await nodeContainer.create();
    
        // starts the container
        await nodeContainer.run();
    
        // streams the container output after instructions to run code
        await nodeContainer.executeAllStreamLast([
            ["sh", "start.sh", this.problemName + this.fileExt, this.codeToRun],
            ["python3", this.problemName + "_test.py", "-v"],
        ], cb);
    };
};

// const docker = new Dockerode();

// const getConfig = () => ({
//         Tty: true,
//         Image: 'python-runner',
//         Cmd: ["sh"],
//         HostConfig: {
//             NetworkMode: 'none',
//             AutoRemove: true,
//             Memory: 100000000,
//             Privileged: false,
//             MemoryReservation: 7000000,
//             CpuQuota: 1000000,
//         },
//     }
// );

// const writeScript = (fn : string, code : string) => ({Cmd: ["sh", "start.sh", fn + ".py", code], AttachStderr: true, AttachStdout: true});
// const runTests = (fn: string) => ({Cmd: ["python3", fn + "_test.py", "-v"], AttachStderr: true, AttachStdout: true});



// async function pythonRunner(fn : string, code : string, cb: any){
//     let res = ""; 
   
//     const container = await docker.createContainer(getConfig());
//     console.log("created container at ", Date.now() / 1000);
//     await container.start();

//     console.log("started container at ", Date.now() / 1000);
//     await (await container.exec(writeScript(fn, code))).start({});
//     console.log("wrote to container at ", Date.now() / 1000);
//     const stream = await (await container.exec(runTests(fn))).start({});
//     console.log("started tests at ", Date.now() / 1000);

//     stream.on("data", (data)=>{
//         res = res + data.toString(); 
//     });

//     stream.on("end", ()=>{
//         console.log("ended at ", Date.now() / 1000);
//         cb(res, null);
//         container.inspect((err, stats)=>{
//             if (err) cb(null,err);
//             if (stats?.State.Running === true) container.stop();
//         });
//     });

// }; 


// module.exports = pythonRunner;