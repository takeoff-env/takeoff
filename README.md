# Takeoff

Takeoff is a rapid prototyping server that uses docker to minimise getting your server, database and frontend up and running.

Under this it uses frontend and backend hot reloading to allow you to make changes without the need to usually* restart the server.

* *(Obvious uncontrolled crashes aside)*

## How to run

Clone or fork this this repository:

    git clone https://github.com/tanepiper/takeoff.git

Then run `npm install` in the root, this creates the basic bootstrap needed to run things. Next:

    > npm run build:dev
    > npm run up:dev
> *in the future there will be support for custom names here*

You should now have a server running at [http://localhost](http://localhost). You can access the API via [http://localhost/api](http://localhost/api).

## Architecture

You will find 5 folders and some files:

    -|
     |- api
     |- app
     |- config
     |- docker
     |- scripts
     |- README.md
     |- package.json

There are some convenience NPM scripts that get the environment going:

> `npm run build:dev`
> : this command runs the docker compose file which creates the initial environment

> `npm run up:dev`
> : this command runs the development enviromnent on localhost

Inside the docker folder and several docker files which create the environments.

The default environments are listed below with the main environments from their docker files.  Full components will be listed soon.

|name|packages|version|description|
|----|-------|-------|-----------|
|api |node   |8.4.0  |Hapi-powered API that comes pre-build with a user and authentication plugin, uses nodemon for changes.|
|app |node   |8.4.0  |Webpack/React app that is hot-reloaded on changes