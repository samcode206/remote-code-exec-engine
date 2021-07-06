const nodeRunner = require("./adapters/javascript/nodeRunner.js");
const sandboxScript = require("./adapters/javascript/nodeRunner");
// const problemName = "fib"; 
const probs = require("./problems/probs");


module.exports = function(job, done){
    
    console.log("recieved job with id" + job.id + "at:" , new Date());
    const code = job.data.code;
    const prob = job.data.problem; 
  
    const boxedCode = sandboxScript(code, prob, probs.fib.argNums);


    nodeRunner(prob, boxedCode, (res, err) =>{
      if (!err){
        console.log("complete");
        const r = res.replace(/[^\x20-\x7E]/g, "");
        done(null, r);

      } else {
        console.log("failed");
        done(null, err);
      }
    });
};