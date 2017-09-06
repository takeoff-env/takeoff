# Command Line

Takeoff ships with some command line scripts that provide convinient actions to control your stack.

The commands are all invoked by using `npm run` (e.g `npm run takeoff:build`) and invoke scripts that live in the `utilities` folder.

These scripts are opinionated and don't output a lot of junk to the console.  If your build fails for any reason you can run it like this to get verbose logs:

```bash
npm run takeoff:build -- -v
```

> *You need to pass `--` to npm to send the flag to the underlying command, otherwise you are just running `npm -v`. Please note these command line tools are in heavy development and likely to change at any time and improvements to the interactions will be added*

The only exception is the `docker-compose up` command which will output the live logs of the apps running in docker.  To hide this, you can pass `-h`

## Takeoff Commands

Some of these commands take the `--env [name]` command, the default value is `dev`.

|Command|Description|
|-------|-----------|
|`npm start`|Starts `docker-compose` using the environment file with any built environment|
|`npm run takeoff:build`|Triggers a multi-step `docker-compose build`|
|`npm run takeoff:clean`|Cleans the `node_modules` directories of `app` and `api` and cleans out the previous build images|

## Docker Compose Commands

All these commands take the `--env [name]` command, the default value is `dev`.

|Command|Description|
|-------|-----------|
|`npm run compose:build`|Builds the docker images. Pass `-c` to build from the cache.|
|`npm run compose:up`|Starts the docker images `docker-compose up`. Pass `-h` to hide the docker output. Pass `-d [name]` to only trigger on a specific service|
|`npm run compose:stop`|Stops the docker images `-d [name]` to only trigger on a specific service|
|`npm run compose:down`|Removes the current docker images `-d [name]` to only trigger on a specific service|
|`npm run compose:rm`|Destroys all build docker images.|

