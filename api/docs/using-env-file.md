# Using an environment file

You can create a `.env` file at the root of `api` to set certain environment variables.  This allows you to overide
certain configuration options

Current available variables are:

|Variable           |default        |Description|
|--------           |-------        |-----------|
|NODE_ENV           |development    |The node development environment, used for general global settings
|AUTH_PRIVATE_KEY   |change-me      |The private key for authentication and JWT
|API_PREFIX         |/              |The API prefix
