# Building a new server configuration

[Home](../../README.md) | [API](../README.md)

The Takeoff API server uses [Glue](https://github.com/hapijs/glue) as a format for composing the server.

In `api/config` there are two files, `_base.js` and `development.js`.

The `_base.js` configuration provides all the basic features needed to get the API server running. It returns an object
that contains a set of default values listed below.  For more information on the options you can pass, see the
[Hapi documentation for server](https://hapijs.com/api#server)

## `development` defaults

The development defaults are in `api/config/development.js`. The file name is based on the `NODE_ENV` variable set, so you can put a file in
here with any name provided you want to run that environment.

You will always need to start by importing the base config from the file (unless you want full control over your config file)

```js
const baseConfig = require('./_base');
const newConfig = Object.assign({}, baseConfig);
newConfig.sever.debug.log = ['debug'];
newConfig.app.apiPrefix = '/foo/';
newConfig.registrations.push({
    plugin: './ping'
}, {
    plugin: {
        register: './auth',
        options: {
            privateKey: process.env.AUTH_PRIVATE_KEY || 'change-me',
            tokenExpiry: 3600,
            maxAge: '1h',
            cookieName: 'auth-cookie',
            algorithm: 'HS256',
            algorithms: ['HS256'],
            userTypes: ['admin', 'user']
        }
    }
});

module.exports = newConfig;
```

## Defaults

### `server`

|key|type|value|
|---|----|-----|
|`debug.log`|Array|`['error', 'debug']`|
|`debug.request`|Array|`['error']`|

### `app`

|key|type|value|
|---|----|-----|
|`app.root`|String|`/api/`|
|`app.apiPrefix`|String|`/`|
|`app.cookieSettings.ttl`|Number or `null`|`null`
|`app.cookieSettings.isSecure`|Boolean|`false`
|`app.cookieSettings.isHttpOnly`|Boolean|`true`
|`app.cookieSettings.clearInvalid`|Boolean|`false`
|`app.cookieSettings.path`|String|`/`

### `connections`

|key|type|value|
|---|----|-----|
|`connections.port`|Number|`8080`|
|`connections.labels`|Array|`['api']`|
|`connections.router.stripTrailingSlash`|Boolean|`true`|
|`connections.routes.cors.origin`|Array|`[*]`|

### `registrations`

Registrations are how plugins are registered with Hapi. This is held in an array of objects. 

The default plugins are:

* `hapi-auth-jwt`: Provides the basic authentication library for JSON Web Tokens (not to be confused with the `auth` plugin that provide the implementation)
* `inert`: Library for serving static files
* `vision`: Library for rendering server side templates, currently uses `handlebars`
