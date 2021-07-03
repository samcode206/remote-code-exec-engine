const parseArgs = require("../problems/parseArgs.js");

const sandboxScript = (code, problemName, numArgs) => `
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


module.exports = sandboxScript;