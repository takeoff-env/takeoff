# Using an environment file

[Home](../../README.md) | [App](../README.md)

You can create a `.env` file at the root of `app` to set certain environment variables.  This allows you to overide
certain configuration options as your server starts up, or provide options to your app.

You access these values via nodes standard `process.env` in the webpack config. The `webpack.DefinePlugin` is used to pass them to the frontend app.

Current available variables are:

## Server and environment

|Variable           |default        |Description|
|--------           |-------        |-----------|
|NODE_ENV           |development    |The node development environment, used for general global settings
|PORT               |10001          |The port the app will run on, note you will need to update the docker configuration
|REDUX_DEV_TOOLS    |true           |Enables or disables the support for the [Redux Devtools Extension](https://github.com/zalmoxisus/redux-devtools-extension)
