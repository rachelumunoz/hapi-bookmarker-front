'use strict'

const Hapi = require('Hapi')

//create server and connetion

const server = new Hapi.Server({
  app: {
    apiBaseUrl: 'http://localhost:3000'
  }
})

server.connection({
  port: 4000
})

//creat route

server.route({
  method: 'GET',
  path: '/',
  handler: (request, reply)=>{
    return reply('hello from hapi')
  }
})


//register plugin
server.register({
  register: require('good'),
  options: {
    reporters: {
      console: [{
        module: 'good-squeeze',
        name: 'Squeeze',
        args: [{
          log: '*',
          response: '*'
        }]
      },{
        module: 'good-console'
      }, 'stdout']
    }
  }
}, (err)=>{
  server.start(err=>{
    if(err){
      throw err
    }
    console.log(`server is running at ${server.info.uri}`)
  })
})
