# Takeoff Blueprints

Takeoff is the core program that allows the easy deployment of blueprints as environments.

A basic blueprint has the following layout:

    |package.json
    |takeoff.config.js
    |- env
        |- <application 1>
        |- <application 2>
    |- docker
        |- docker-compose.yml
        |- application1
            |- Dockerfile
        |- application2
            |- Dockerfile

## Components

### `package.json`

The `package.json` should have the following minimum items in it:

```json
{
  "name": "takeoff-blueprint-<name>",
  "version": "1.0.0",
  "description": "Description of your package",
  "keywords": [
    "takeoff",
    "blueprint",
    "anotherKeyword"
  ],
  "licence": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/takeoff-env/takeoff-blueprint-<name>.git"
  },
  "author": "You <foo@bar.com>"
}
```

Currently we don't use the keywords, but will the future CLI took will support these when searching for blueprints.

### `takeoff.config.js`

This is a plugin file that is used to bootstrap an environment. It will be run when your environment is installed via the `init` or `new` commands. To start a config file:

```js
module.exports = async ({ command, shell, args, opts, workingDir, h }) => {
  // Do code in here
  // command = string name of the command called
  // shell = shelljs instance for doing shell commands and echo
  // args = An array of args for you to detructure
  // opts = An object of options, either boolean or string values
  // workingDir = The working directory where the command was run from
  // h = A helper library, currently contains table and progressbar
  return true;  // Return true at the end, if your code fails at any point return false
}
```

You can see an example file [here](https://github.com/takeoff-env/takeoff-blueprint-basic/blob/master/takeoff.config.js).  **Please Note** as of version 1.2 this format is still in beta and there may be changes, the documentation will be kept up to date to reflect that.

### `env`

The `env` folder contains all your application code and assets.  This allows you to mount these as volumes in the `docker-compose.yml` file.

### `docker`

This is the docker configuration folder, it contains a `docker-compose.yml`. This is where you configure your services that talk to each other. Take a look at the [basic examples file](https://github.com/takeoff-env/takeoff-blueprint-basic/blob/master/docker/docker-compose.yml)

Also within the docker folder are the name of your services you wish to serve.  These can be simple one line configurations, or complex sets of scripts to be run in order.
