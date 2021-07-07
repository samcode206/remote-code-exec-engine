export default abstract class Runner {
    public codeToRun : string;  
    public problemName : string;
    constructor(code: string, problem : string, numArgs : number){
        this.codeToRun = this.sandbox(code, problem, numArgs);
        this.problemName = problem;

    };

    abstract sandbox(code : string, problemName : string, numArgs : number): string;
    abstract run(cb: any): void;
};
