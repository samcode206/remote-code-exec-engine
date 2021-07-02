const Dockerode = require("dockerode");


const docker = new Dockerode();


const shutDown = () => {
    docker.listContainers((err, conts)=>{
        conts.forEach((containerInfo)=>{
            if (containerInfo.Image === "example"){
                const id = containerInfo.Id
                docker.getContainer(id).stop((er, res)=>{
                    console.log(er, res)
                    
                });
                docker.getContainer(id).remove()
            }
        })
    });
}; 


shutDown()


