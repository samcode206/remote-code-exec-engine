const nodeRunner = require("./adapters/nodeRunner.js");
const sandboxScript = require("./adapters/script.js");
const problemName = "fib"; 
const probs = require("./problems/probs");


const code = sandboxScript(`
function fib(a) {
    if (a <= 1) return 1;
  
    return fib(a - 1) + fib(a - 2);
  }
  
`, probs.fib.name, probs.fib.argNums);

console.log(code);
nodeRunner(problemName, code, (result, err) =>{
    console.log(result, err);
});

console.log(code);