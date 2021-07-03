import Fastify, { FastifyInstance, RouteShorthandOptions } from 'fastify'
// import { Server, IncomingMessage, ServerResponse } from 'http';

const server: FastifyInstance = Fastify();

const opts: RouteShorthandOptions = {
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
          }
        }
      }
    }
  }
}

server.get('/', opts, async (request, reply) => {
    return reply.send({message: 'it worked!'})
});


(async () => {
    try {
      await server.listen(3000)
  
      const address = server.server.address()
      const port = typeof address === 'string' ? address : address?.port
  
      console.log("listening on port", port);
      
    } catch (err) {
      server.log.error(err)
      process.exit(1)
    }
  })();

