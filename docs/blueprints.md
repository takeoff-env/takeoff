# Takeoff Blueprints

Takeoff is the core program that allows the easy deployment of blueprints as environments.

A basic blueprint has the following layout:

    |package.json
    |takeoff.md
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

### `takeoff.md`

The `takeoff.md` file is used to define the tasks that get run in order in a blueprint for setup.  This allows you to install local dependencies as well as run shell commands before running the docker commands.  Here you have full control over how the blueprint setup runs.

```md
    ## npm:install:api

    Run task `npm:install:app` after this

    ```bash
    cd env/api && npm install --silent
    ```

    ## npm:install:app

    Run task `docker:compose` after this

    ```bash
    cd env/frontend-app && npm install --silent
    ```

    ## docker:compose

    ```bash
    docker-compose -f docker/docker-compose.yml build --no-cache
    ```
```

The first task in the file is always run, and then you tell is which subsequent tasks you want it to run.  Use `bash` as a tick block helper to define the commands. They are run from the root of the project directory (e.g. `takeoff/projects/my-project`). The format has been simplified from [Maid](https://github.com/egoist/maid) which it is inspired from, and the intention is to re-add features however this is a lower priority just now.


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

Currently we don't use the keywords, but in future the CLI will support these when searching for blueprints.

### `env`

The `env` folder contains all your application code and assets. This allows you to mount these as volumes in the `docker-compose.yml` file.

### `docker`

This is the docker configuration folder, it contains a `docker-compose.yml`. This is where you configure your services that talk to each other. Take a look at the [basic examples file](https://github.com/takeoff-env/takeoff-blueprint-basic/blob/master/docker/docker-compose.yml)

Also within the docker folder are the name of your services you wish to serve. These can be simple one line configurations, or complex sets of scripts to be run in order.
