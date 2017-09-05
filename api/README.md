# API App

To build a new feature for the API App, you can add a new database mode (with migration and seed) and a plugin.

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
