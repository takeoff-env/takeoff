# Takeoff Blueprints

Takeoff is the core program that allows the easy deployment of blueprints as environments.

A basic blueprint has the following layout:

    |package.json
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

### `env`

The `env` folder contains all your application code and assets.  This allows you to mount these as volumes in the `docker-compose.yml` file.

### `docker`

This is the docker configuration folder, it contains a `docker-compose.yml`. This is where you configure your services that talk to each other. Take a look at the [basic examples file](https://github.com/takeoff-env/takeoff-blueprint-basic/blob/master/docker/docker-compose.yml)

Also within the docker folder are the name of your services you wish to serve.  These can be simple one line configurations, or complex sets of scripts to be run in order.


## Optional `lerna.json`

If you have node applications, you need to install the dependencies for the users.  You can add a `lerna.json` file to your blueprint, pointing to your node applications.  From the basic blueprint, it looks like this:

```json

{
    "lerna": "2.1.2",
    "packages": [
      "env/api",
      "env/app"
    ],
    "version": "1.0.4"
  }
```
