const nodeRunner = require("./adapters/nodeRunner.js");
const sandboxScript = require("./adapters/script.js");
// const problemName = "fib"; 
const probs = require("./problems/probs");


module.exports = function(job, done){

    console.log("recieved job at: ", new Date());
    const code = job.data.code;
    const prob = job.data.problem; 
  
    const boxedCode = sandboxScript(code, prob, probs.fib.argNums);


    nodeRunner(prob, boxedCode, (res, err) =>{
      if (!err){
        console.log(res);
        const r = res.replace(/[^\x20-\x7E]/g, "");
        done(null, r);
        console.log(r);
        return Promise.resolve(r);

      } else {
        console.log(err);
        done(null, err);
        return Promise.reject(err);
      }
    });
};