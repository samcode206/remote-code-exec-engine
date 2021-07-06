// import Bull, {Job} from 'bull';
import nodeRunner from "./adapters/javascript/nodeRunner";
import sandboxScript from "./adapters/javascript/script";
import probs from "./problems/probs";
import Queue, {Job, DoneCallback} from "bee-queue";


const codeQueue = new Queue("run-code", {
  redis:{
    port: 6379,
    host: "127.0.0.1",
  }
});


interface jobAttrs {
  code : string
  problem : string
};


codeQueue.process(8, (job : Job<jobAttrs>, done : DoneCallback<string>) =>{
  console.log("recieved job with id" + job.id + "at:" , new Date());
  const code = job.data.code;
  const prob = job.data.problem; 

  const boxedCode = sandboxScript(code, prob, probs.fib.argNums);


  nodeRunner(prob, boxedCode, (res : any, err: any) =>{
    if (!err){
      console.log("complete");
      const r = res.replace(/[^\x20-\x7E]/g, "");
      done(null, r);

    } else {
      console.log("failed");
      done(null, err);
    };
  });
}
);

