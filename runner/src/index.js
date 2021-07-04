const Queue = require("bull");
const nodeRunner = require("./adapters/nodeRunner.js");
const sandboxScript = require("./adapters/script.js");
const problemName = "fib"; 
const probs = require("./problems/probs");


const codeQueue = new Queue("run-code", {
  redis:{
    port: 6379,
    host: "127.0.0.1",
  }
});

codeQueue.process((job, done)=>{

  const code = job.data.code;
  const prob = job.data.problem; 

  const boxedCode = sandboxScript(code, prob, probs.fib.argNums);

  nodeRunner(prob, boxedCode, (res, err) =>{
    if (!err){
      console.log(res);
      const r = res.replace(/[^\x20-\x7E]/g, "");
      done(null, r);

    } else {
      console.log(err);
      done(null, err);
    }
  });


  // done(null, "hello from runner"); 
});


// const code = sandboxScript(`function fib(a) {if (a <= 1) return 1;return fib(a - 1) + fib(a - 2);}`, probs.fib.name, probs.fib.argNums);

// nodeRunner(problemName, code, (result, err) =>{
//     const r = result.replace(/[^\x20-\x7E]/g, "");
//     console.log(r, err);
// });

