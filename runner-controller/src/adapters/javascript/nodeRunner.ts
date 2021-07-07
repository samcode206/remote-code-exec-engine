import Container from "../docker/Docker";
import parseArgs from "../../problems/parseArgs";
import Runner from "../../core/Runner";

export default class NodeJs extends Runner {
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
    // public codeToRun : string;  
    // public problemName : string;
    constructor(code: string, problem : string, numArgs : number){
        super(code, problem, numArgs);
        // this.problemName = problem; 
        // this.codeToRun = this.sandbox(code, problem, numArgs);
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
            ["jest", this.problemName + ".test" + this.fileExt],
        ], cb);
    };

    sandbox(code : string, problemName : string, numArgs : number) :string{
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
    };
    // sandboxWithGlobal(code , problemName, numArgs, globals){
    //     // adds global variables
    // };
};
