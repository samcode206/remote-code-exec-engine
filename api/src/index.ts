import Fastify, { FastifyInstance } from 'fastify';
import Queue from 'bull';


const codeQueue = new Queue("run-code", {
  redis:{
    port: 6379,
    host: "127.0.0.1",
  }
});




const server: FastifyInstance = Fastify();




interface CodeAttrs {
  code: string;
  problem: string; 
}

server.post<{Body: CodeAttrs}>('/code', async (request, reply) => {
  try{
    console.log("recieved request at: ", new Date());
    const {body} = request; 
   
  const job = await codeQueue.add(body);

  const res = await job.finished();


  console.log(res); 
  reply.send({results: res, dateResolved: Date.now() / 1000});

  } catch(err){
    console.log(err);
    reply.send({});
  }
  

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
      await server.listen(5000)
  
      const address = server.server.address();
      const port = typeof address === 'string' ? address : address?.port;
  
      console.log("listening on port", port);
      
    } 
    catch (err) {
      server.log.error(err)
      process.exit(1)
    };
  })();

