# Building Async/Await Plugins

[Home](../../README.md) | [API](../README.md)

As Takeoff uses node 8, we can use async/await functions that can make code much clearer.

In the `using` plugin there is code that creates a new uses. First we hash the password, then we save the users to the database - both asynchronous methods.

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

As you can see, `hashPassword` is an async function that returns a Promise, as does `server.app.db.User.create`. In both cases we use the `await` keyword, inside a `async function` that we are returning. This makes the code more readable and error tolerent.  At the moment there is no robust error handling here, but this can be build in.
