const Queue = require("bull");



// const problemName = "fib"; 
const probs = require("./problems/probs");


const codeQueue = new Queue("run-code", {
  redis:{
    port: 6379,
    host: "127.0.0.1",
  }
});

codeQueue.process(8,`${__dirname}/process.js`);

