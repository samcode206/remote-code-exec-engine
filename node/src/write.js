const fs = require("fs");




const write = () => {
fs.writeFileSync("./src/addNums.js", `
const add = (n1, n2) =>{

    return n1 + n2; 
}

module.exports = add; 

`)
}

module.exports = write; 