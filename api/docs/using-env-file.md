# Using an environment file

[Home](../../README.md) | [API](../README.md)

You can create a `.env` file at the root of `api` to set certain environment variables.  This allows you to overide
certain configuration options as your server starts up, or provide options to your plugin.

You access these values via nodes standard `process.env`

Current available variables are:

## Server and environment

|Variable           |default        |Description|
|--------           |-------        |-----------|
|NODE_ENV           |development    |The node development environment, used for general global settings
|PORT               |10000          |The port the app will run on, note you will need to update the docker configuration
|AUTH_PRIVATE_KEY   |change-me      |The private key for authentication and JWT
|API_PREFIX         |/api/          |The API prefix from the proxy server

## Postgres Database

|Variable           |default        |Description|
|--------           |-------        |-----------|
|DB_NAME            |myappdb        |The database name|
|DB_USER            |myappuser      |The username to access the database|
|DB_PASSWORD        |myapppassword  |The password to access the database|
|DB_HOST            |"db"           |The host of the database, defaults to "db" as per docker compose links (the quotes are deliberate)|
|DB_PORT            |5432           |The port the database should run on|
