# Takeoff API

[Home](../README.md)

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
* [Building `async/await` plugins](docs/building-async-await-plugins.md)
