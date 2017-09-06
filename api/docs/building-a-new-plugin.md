# Building a new Takeoff API Plugin

[Home](../../README.md) | [API](../README.md)

Takeoff uses Hapi as it's framework to build server-side services. Functionality is added via plugins which are defined in the `api/server/plugins`
folder, and whitelisted via a config file.

## Plugin structure

Plugins provide a way to create logical units of code. First, create your folder.  Here we'll create a simple `hello-world` plugin.

> $ `cd api/server/plugins`
>
> $ `mkdir hello-world && touch hello-world/index.js`

In our index file, we create the following plugin registration file:

```js
const registerPlugin = (server, options, next) => {

    const apiServer = server.select('api');

    apiServer.route({
        method: 'GET',
        path: '/hello-world',
        config: {
            auth: false
        },
        handler: function (req, reply) {
            return reply({greeting: 'hello world'});
        }
    });

    return next();
};

registerPlugin.attributes = {
    name: 'hello-world',
    version: '1.0.0',
    dependencies: []
};

module.exports = registerPlugin;
```

Next, open `api/config/development.js`, and find the line that says `baseConfig.registrations.push`.  At the bottom of the parameters, add:

```js
baseConfig.registrations.push(
...
, {
    plugin: './hello-world'
});
```

Now you can visit [http://localhost/api/hello-world](http://localhost/api/hello-world) - and as you can see, you haven't had to restart any server manually, it just works.

If you want to provide your plugin options, you can instead pass this to the above `.push` method:

```js
...
{
    register: './hello-world',
    options: {
        greeting: 'hello'
    }
}
...
```

Then you would access them like this:

```js
const registerPlugin = (server, options, next) => {
...
    handler: function (req, reply) {
        return reply({greeting: `${options.greeting} world`});
    }
...
}
```

## Reference

* [Hapi Plugin Documentation](https://hapijs.com/tutorials/plugins)
