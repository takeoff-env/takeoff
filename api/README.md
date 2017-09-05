# Takeoff API

The Takeoff API is built on Hapi, with a simple composed configuration using Glue that creates the server.

It's run via nodemon, so this listens for changes in the code tree.

The setup has been battle tested and works well for rapid development of new features via a plugin system.

The server is fully configurable, and ultimatly replacable with anything such as Express.

## API Documentation

* [Configuring a server environment variables](docs/using-env-file.md)
* [Building a server configuration](docs/building-a-server-configuration.md)
* [Building a new plugin](docs/building-a-new-plugin.md)
* [Working with the default database](docs/working-with-the-database.md)
* [Using JWT Scopes in your plugin](docs/using-jwt-scopes.md)


## New Model

## New Plugin

To add a new plugin, first create a folder under `api/server/plugins` with your plugin name, and a `index.js` file that looks like this:

```js
const registerPlugin = (server, options, next) => {

    server.route({
        method: 'GET',
        path: '/my-endpoint',
        config: {},
        handler: (req, reply) => {  // This can be a async function!
            res.reply('Hi');
        }
    });
    return next();
};


registerPlugin.attributes = {
    name: 'my-plugin',
    version: '1.0.0',
    multiple: false
};


module.exports = registerPlugin;
```

In my projects I put my handlers in their own files and use dependency injection to get the features I need.  For example on the users plugin, for adding a new user I have the following method:

```js
const { hashPassword } = require('../utils');

module.exports = server => {
    return async function(req, reply) {
        const { username, password, role, displayName } = req.payload;

        try {
            const hashedPassword = await hashPassword(password);
            const userObject = {
                role,
                username,
                password: hashedPassword,
                displayName: displayName
            };

            const data = await server.app.db.User.create(userObject);
            return reply({ success: true, data });
        } catch (e) {
            reply(e);
        }
    };
};
```

It's called by adding a route like this:

```js
const Joi = require('joi');
const { hashPassword } = require('../utils');
...
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
...
```
