const Path = require('path');

const API_PREFIX = process.env.API_PREFIX || '/';
//const PUBLIC_PREFIX_PATH = '/public';

module.exports = {
  server: {
    debug: {
      log: ['error', 'debug'],
      request: ['error']
    },
    app: {
      root: Path.resolve(__dirname, '..'),
      apiPrefix: API_PREFIX,
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
    port: process.env.PORT || 8080,
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