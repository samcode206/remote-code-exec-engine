const addNums = require("./addNums.js"); 


it("should add two numbers", () =>{
    const r = addNums(1,1);
    expect(r).toEqual(2); 
})