const Path = require('path');

module.exports = {
  server: {
    debug: {
      log: ['error', 'debug'],
      request: ['error']
    },
    app: {
      root: Path.resolve(__dirname, '..'),
      apiPrefix: process.env.API_PREFIX || '/',
      cookieSettings: {
        ttl: null,
        isSecure: false,
        isHttpOnly: true,
        clearInvalid: false, // remove invalid cookies
        path: '/'
      }
    }
  },
  connections: [{
    port: process.env.PORT || 10000,
    labels: ['api'],
    router: {
      stripTrailingSlash: true
    },
    routes: {
      cors: {
        origin: ['*']
      }
    }
  }],

  registrations: [
    {
      plugin: 'hapi-auth-jwt'
    },
    {
      plugin: 'inert'
    },
    {
      plugin: 'vision'
    }
  ]
};
