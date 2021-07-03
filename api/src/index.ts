import Fastify, { FastifyInstance } from 'fastify';


const server: FastifyInstance = Fastify();

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




interface CodeAttrs {
  code: string;
  problem: string; 
}

server.post<{Body: CodeAttrs}>('/code', (request, reply) => {
  const {body} = request; 
  
  console.log(body.code);

  reply.send({ack: true});

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

