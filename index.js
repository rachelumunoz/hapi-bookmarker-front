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

//register plugin
server.register([{
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
}, {
  register: require('inert')
}, {
  register: require('vision')
}, {
  register: require('hapi-auth-cookie')
}, {
  register: require('./plugins/error')
}, {
  register: require('./plugins/auth')
}, {
  register: require('./routes/bookmarks')
}, {
  register: require('./routes/auth')
}], (err)=>{
    
    if (err){
      throw err 
    }

    // serves static assets
    server.route({
      method: 'GET',
      path: '/{param*}',
      handler: {
        directory: {
          path: './public',
          redirectToSlash: true
        }
      }
    })

    // sets view engine
    server.views({
      engines: {
        hbs: require('handlebars')
      },
      relativeTo: __dirname,
      path: './templates',
      helpersPath: './templates/helpers',
      layoutPath: './templates/layouts',
      layout: true, 
      isCached: false, // should be true in production
      context: (request)=>{
        return { user: request.auth.credentials }
      }
    })

    // redirect from root
    server.route({
      method: 'GET',
      path: '/',
      handler: function(request, reply){
        return reply.redirect('/bookmarks')
      }
    })


    server.start(err=>{
      if(err){
        throw err
      }


    console.log(`server is running at ${server.info.uri}`)
  })
})
