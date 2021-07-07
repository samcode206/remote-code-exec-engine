import Queue, {Job, DoneCallback} from "bee-queue";
import NodeJs from "../adapters/javascript/nodeRunner";
import {OrchestratorAttrs, jobAttrs, languages} from "../props/props";

class Orchestrator {
    private queue : Queue;
    // default to one for concurrency 
    private concurrency : number;
    constructor(optns : OrchestratorAttrs){
      this.concurrency = optns.concurrency;
      this.queue = new Queue(optns.queueName, optns.setting);
    };
  
    listenForJobs(){
      this.queue.process(this.concurrency, this.processor);
    };
  
  
    processor(job : Job<jobAttrs>, done : DoneCallback<string>) : void {
      console.log("recieved job with id" + job.id + "at:" , new Date());
    const code : string = job.data.code;
    const prob : string = job.data.problem; 
    const lang : string = job.data.lang; 
  
    // the callback responsive for calling done 
    const cb = (res : any, err : any) : void =>{
      if (!err){
        console.log("complete");
        const r = res.replace(/[^\x20-\x7E]/g, "");
        done(null, r);
  
      } else {
        console.log("failed");
        done(err);
      };
    };
  
    if (lang === languages.javascript){
      // nodejs 
      const js = new NodeJs(code, prob, 1);
      js.run(cb);
  
    } 
    else if (lang === languages.python){
  
    }
     else {
      cb(null, new Error("language not supported!"));
    }
    };
  
  };


  export default new Orchestrator({
    queueName: "run-code",
    setting: {
      redis: {
        port: 6379,
        host: "127.0.0.1"
      }
    },
    concurrency: 2,
  });