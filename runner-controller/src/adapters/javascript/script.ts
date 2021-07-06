import parseArgs from "../../problems/parseArgs";


const sandboxScript = (code : string, problemName : string, numArgs : number) => `
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


export default sandboxScript;