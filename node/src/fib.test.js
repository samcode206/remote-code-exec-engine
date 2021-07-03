const fib = require("./fib.js"); 


it("calculate the right fib sequence", () =>{
    const r = fib(5);
    expect(r).toEqual(8); 
})

it("calculate the right fib sequence number 8", () =>{
    const r = fib(8);
    expect(r).toEqual(34); 
})

it("calculate the right fib sequence give basecase", () =>{
    const r = fib(1);
    expect(r).toEqual(1); 
})