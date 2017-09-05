const Joi = require('joi');
const validateToken = require('./lib/validate-token');

/**
 * This plugin handles all auth requests for any user type
 * @param server
 * @param options
 * @param next
 * @returns {*}
 */
const registerPlugin = (server, options, next) => {

  /**
   * Define that the server uses the JSON Web Token strategy for auth
   * and session handling
   */
  server.auth.strategy('token', 'jwt', {
    key: options.privateKey,
    validateFunc: validateToken,
    verifyOptions: { algorithms: options.algorithms, maxAge: options.maxAge }
  });
  server.auth.default('token');

  server.route({
    method: 'GET',
    path: '/auth/{userType}',
    config: {
      auth: false,
      description: 'Authorisation endpoint, takes the type of user and runs through the handler',
      notes: 'Takes a username and password and returns a JSON web token',
      tags: ['api', 'auth'],
      validate: {
        params: {
          userType: Joi.string().valid(options.userTypes)
        }
      }
    },
    handler: require('./handlers/get-login')(server, options)
  })

  /**
   * Auth route for pupils
   */
  server.route({
    method: 'POST',
    path: '/auth/{userType}',
    config: {
      auth: false,
      description: 'Authorisation endpoint, takes the type of user and runs through the handler',
      notes: 'Takes a username and password and returns a JSON web token',
      tags: ['api', 'auth'],
      validate: {
        params: {
          userType: Joi.string().valid(options.userTypes)
        },
        payload: {
          username: Joi.string().required(),
          password: Joi.string().required()
        }
      }
    },
    handler: require('./handlers/post-user-for-login')(server, options)
  });

  return next();
};

registerPlugin.attributes = {
  name: 'auth',
  version: '1.0.0',
  dependencies: []
};

module.exports = registerPlugin;
