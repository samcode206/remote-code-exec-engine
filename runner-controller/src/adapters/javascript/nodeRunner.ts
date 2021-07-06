import Container from "../docker/Docker";
import parseArgs from "../../problems/parseArgs";

export default class NodeJs {

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

    private fileExt : string = ".js"; 
    public javascript : string;  
    public problemName : string;
    constructor(code: string, problem : string, numArgs : number){
        this.problemName = problem; 
        this.javascript = this.sandbox(code, problem, numArgs);
    };

    async run(cb : any){
        const nodeContainer = new Container(this.config);

        // creates the container with given settings 
        await nodeContainer.create();
    
        // starts the container
        await nodeContainer.run();
    
        // streams the container output after instructions to run code
        await nodeContainer.executeAllStreamLast([
            ["sh", "start.sh", this.problemName + this.fileExt, this.javascript], 
            ["jest", this.problemName + ".test" + this.fileExt],
        ], cb);
    };

    sandbox(code : string, problemName : string, numArgs : number){
        return `
        const {VM, VMScript} = require("vm2"); 
        const vm = new VM({
            timeout: 6000,
            compiler: "javascript",
            eval: false,
            wasm: false,
            fixAsync: true,
        });
        const ${problemName}Script = ${parseArgs(numArgs,false)} => {
           return new VMScript(\`${code} \n ${problemName} ${parseArgs(numArgs,true)}\`);
        }
        const ${problemName} = ${parseArgs(numArgs,false)} => {
            return vm.run(${problemName}Script${parseArgs(numArgs,false)});
        }; 
        module.exports = ${problemName}; 
        `;
    }
    
};


// const getConfig = () => ({
//         Tty: true,
//         Image: 'node-runner',
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



// async function runNode(problemName: string, code: string, cb: any){
//     const nodeContainer = new Container(getConfig());

//     // creates the container with given settings 
//     await nodeContainer.create();

//     // starts the container
//     await nodeContainer.run();

//     // streams the container output after instructions to run code
//     await nodeContainer.executeAllStreamLast([
//         ["sh", "start.sh", problemName + ".js", code], 
//         ["jest", problemName + ".test.js"],
//     ], cb);
// };

// export default runNode;
