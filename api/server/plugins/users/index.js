const Joi = require('joi');

const registerPlugin = (server, _options, next) => {

  server.route({
    method: 'GET',
    path: '/users',
    config: {
      auth: {
        scope: ['admin']
      },
      description: 'Get a list of users from the system',
      notes: 'Takes optional limit and offset query parameters',
      tags: ['api', 'user'],
      validate: {
        query: {
          limit: Joi.number().default(1000),
          offset: Joi.number().default(0)
        }
      }
    },
    handler: require('./handlers/get-users')(server)
  });

  server.route({
    method: 'POST',
    path: '/users',
    config: {
      auth: {
        scope: ['admin']
      },
      auth: false,
      description: 'Create a new user',
      notes: 'Returns a new user created from a POST request',
      tags: ['api', 'user'],
      validate: {
        payload: {
          username: Joi.string().required(),
          displayName: Joi.string().required(),
          password: Joi.string().required(),
          role: Joi.string().valid([
            'admin',
            'commander',
          ])
        }
      }
    },
    handler: require('./handlers/post-users')(server)
  });

  server.route({
    method: 'GET',
    path: '/users/{id}',
    config: {
      auth: {
        scope: ['admin']
      },
      description: 'Get a user from the system',
      notes: 'Returns an existing user by ID',
      tags: ['api', 'user'],
      validate: {
        params: {
          id: Joi.string().guid().required()
        }
      }
    },
    handler: require('./handlers/get-user-by-id')(server)
  });

  server.route({
    method: 'PUT',
    path: '/users/{id}',
    config: {
      auth: {
        scope: ['admin']
      },
      description: 'Update a user',
      notes: 'Updates a user in the database, returns a success if changed',
      tags: ['api', 'user'],
      validate: {
        params: {
          id: Joi.string().guid().required()
        },
        payload: {
          username: Joi.string().required(),
          password: Joi.string().allow(''),
          role: Joi.string().valid([
            'admin',
            'commander',
          ])
        }
      }
    },
    handler: require('./handlers/put-users')(server)
  });

  server.route({
    method: 'DELETE',
    path: '/users/{id}',
    config: {
      auth: {
        scope: ['admin']
      },
      description: 'Delete a user',
      notes: 'Deletes a user with a specific ID',
      tags: ['api', 'user'],
      validate: {
        params: {
          id: Joi.string().guid().required()
        }
      }
    },
    handler: require('./handlers/delete-users')(server)
  });

  return next();
};

registerPlugin.attributes = {
  name: 'api-users',
  version: '1.0.0',
  multiple: false
};

module.exports = registerPlugin;