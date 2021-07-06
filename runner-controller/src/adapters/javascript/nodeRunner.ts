import Container from "../docker/Docker";


const getConfig = () => ({
        Tty: true,
        Image: 'node-runner',
        Cmd: ["sh"],
        HostConfig: {
            NetworkMode: 'none',
            AutoRemove: true,
            Memory: 100000000,
            Privileged: false,
            MemoryReservation: 7000000,
            CpuQuota: 1000000,
        },
    }
);



async function runNode(fn: string, code: string, cb: any){
    const nodeContainer = new Container(getConfig());

    // creates the container with given settings 
    await nodeContainer.create();

    // starts the container
    await nodeContainer.run();

    // streams the container output after instructions to run code
    await nodeContainer.executeAllStreamLast([
        ["sh", "start.sh", fn + ".js", code], 
        ["jest", fn + ".test.js"],
    ], cb);
};

export default runNode;
