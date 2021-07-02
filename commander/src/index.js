const nodeRunner = require("./adapters/nodeRunner.js");

const problemName = "addNums"; 
const code = `
module.exports = (n1, n2) => {

    return n1 + n2; 
}; 
`;


nodeRunner(problemName, code);

