'use strict'

exports.register = (server, options, next)=>{

  server.auth.strategy('session', 'cookie', 'optional', {
    password: 'eGenCG7wGdzeiKISE7Ftt2A7z623G1I1',
    isSecure: false
  })

  next()
}

exports.register.attributes = {
  name: 'auth'
}