# Takeoff `takeoff.md` File

Takeoff's project initialisation is controlled via the `takeoff.md` file. This uses markdown to define tasks.

An example file looks like this:

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

Each task is done in order, and you specify which task you run after, and is explicit to give full control over the commands. The format is inspired by the [Maid task runner](https://github.com/egoist/maid) and Takeoff uses some of it's code re-written in TypeScript.

The `bash` code blocks are important as they define what type of command it is.  This currently only supports bash, but more types such as `python`, `node`, etc will be added.
