import Dockerode from "dockerode";


class Docker {
    protected docker : Dockerode;
    constructor(){
        this.docker = new Dockerode();
    };
};


export default class Container extends Docker {
    
    private optns : Dockerode.ContainerCreateOptions;

    private container : Dockerode.Container | null;

    private runAttached = {
        AttachStderr: true, 
        AttachStdout: true,
    };

    constructor(optns : Dockerode.ContainerCreateOptions){
        super();
        this.container = null;
        this.optns = optns;
    };

    async create(){
        try {
           this.container = await this.docker.createContainer(this.optns);
           console.log("created container at ", Date.now() / 1000);
        } catch (err){
            throw new Error("error creating a container"); 
        }
    };

    async run(){
       try{
        await this.container?.start();
        console.log("started container at ", Date.now() / 1000);
       } catch(err){
        throw new Error("error starting container"); 
       }
    };

    async execute(cmd : string[]){
        try{
            const command = await this.container?.exec({Cmd: cmd, ...this.runAttached});
            await command?.start({});
        } catch (err){
            console.error(err);
            throw new Error("error executing command see details: "); 
        };
    };

    async executeAndStream(cmd : string[], cb : any){
        try{
            let streamEndResult = "";

            const command = await this.container?.exec({Cmd: cmd, ...this.runAttached});
            const stream = await command?.start({});
            console.log("started tests at ", Date.now() / 1000);
            stream?.on("data", (data)=>{
                streamEndResult = streamEndResult + data.toString(); 
            });

            stream?.on("end", ()=>{
                console.log("ended at ", Date.now() / 1000);
                cb(streamEndResult, null);
                this.container?.inspect((err, stats)=>{
                    if (err) cb(null,err);
                    if (stats?.State.Running === true) this.container?.stop();
                });
            });
        
            
        } catch(err){
            cb(null, err);
        }  
    };

    // specific for what we want for most containers     
    async executeAllStreamLast(cmds: string[][], cb : any){
        try {
            if (cmds.length === 0) throw new Error("must provide commands array of arrays ");
            const last = cmds.pop();
            for await (const command of cmds){
                this.execute(command);
            };

            this.executeAndStream(last!, cb);

        } catch (err){
            cb(null, err);
        };
    };
};

