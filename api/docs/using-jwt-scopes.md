# Using JWT Scopes

[Home](../../README.md) | [API](../README.md)

Extending on [Building a new plugin](building-a-new-plugin.md), we can provide some basic authorisation support in the app.

There are two types of user in the system, `admin` and `user`.  They do not have any special privilages, but a rather properties by which
you can give access to API endpoints.

Extending our widget, we might have:

```js
apiServer.route({
    method: 'GET',
    path: '/hello-world',
    config: {
        auth: {
            scope: ['admin', 'user']
        }
    },
```

In this case, anyone logged in with `admin` or `user` will have access to this endpoint, if you want to restrict the view you can remove one or more user types.  You could even customise the output based on the scope:

```js
{
    ...
    handler: (req, reply) => {
        let greeting;
        if (req.auth.credentials.scope === 'admin') {
            greeting = "Hail overlord";
        } else {
            greeting = "Hello, World"
        }
        return reply({ greeting });
    }
}
```
