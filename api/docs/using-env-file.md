# Using an environment file

[Home](../../README.md) | [API](../README.md)

You can create a `.env` file at the root of `api` to set certain environment variables.  This allows you to overide
certain configuration options as your server starts up, or provide options to your plugin.

You access these values via nodes standard `process.env`

Current available variables are:

|Variable           |default        |Description|
|--------           |-------        |-----------|
|NODE_ENV           |development    |The node development environment, used for general global settings
|AUTH_PRIVATE_KEY   |change-me      |The private key for authentication and JWT
|API_PREFIX         |/              |The API prefix
