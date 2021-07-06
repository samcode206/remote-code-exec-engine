import Fastify from 'fastify';
import cluster from "cluster";
import EventEmitter from "events";
import Queue from "bee-queue";

EventEmitter.defaultMaxListeners = 100;

const codeQueue = new Queue("run-code", {
  redis:{
    port: 6379,
    host: "127.0.0.1",
  }
});


if (cluster.isMaster) {
  // Fork workers.
  for (var i = 0; i < 2; i++) {
    cluster.fork();
  }

  cluster.on('exit', function(worker) {
    console.log('worker ' + worker.process.pid + ' died');
    cluster.fork();
  });

} else {
  // Worker processes have a http server.
  const server = Fastify();


server.post('/code', (request, reply) => {

    console.log("recieved request at: ", Date.now() / 1000);
    // code problem lang 
    const {body} = request; 
   

   const job = codeQueue.createJob(body);
   
   job
   .save()
   .then(job => {
     console.log(`issued job #${job.id} at: `, Date.now() /1000);
   })
   .catch(err => {
     console.error(err);
   });

  job.on("succeeded", result => {
      console.log("success");
      reply.send({results: result, dateResolved: Date.now() / 1000});
  });

  job.on("failed", err => {
    console.log(err);
    reply.send({message: err});
  });
 

}); 



//  entry to our api route (ignore for now maybe add docs later)
server.route({
  method: "GET",
  url: '/',
  schema: {
    // the response needs to be an object with an `hello` property of type 'string'
    response: {
      200: {
        type: 'object',
        properties: {
          message: {type: "string"}
        }
      }
    }
  },
  handler: async (request, reply) => {
    return reply.send({message: "hello"});
  }
});



// start the server iife 
(async () => {
    try {
      await server.listen(80, "0.0.0.0")
  
      const address = server.server.address();
      const port = typeof address === 'string' ? address : address?.port;
  
      console.log("listening on port", port);
      
    } 
    catch (err) {
      server.log.error(err)
      process.exit(1)
    };
  })();


    
}
