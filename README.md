# Takeoff: Rapid Prototyping Environment

<img src="docs/assets/logo.png" width="200px" align="left" style="margin-right:20px" />

Takeoff is a toolbox for rapid prototyping applications.

It is not a framework, and is agnostic to any solutions provided to it - but it ships with an opinionated default.

Under the hood is uses docker to minimise the hassle out of setting up frontend, backend and database servers. Within seconds you'll have a hot-reloading frontend and backend which allows you to make changes without the need to usually restart the server.

The default configuration ships, with a API server powered by Hapi, a React frontend, a Postgres database and a Ngnix server proxying all requests on port 80.

With the API you also get out of the box user management and authentication, and on the frontend a default login page and API middlware to use a JSON Web Token to provide authenticated access. Using the documentation to can then extend these with your own functionality.

There are a set of available commands and tool available to help make the toolbox cross-platform.  These are in the process of being integrated and documented.

Currently only Linux is tested and supported out the box, but support for other OS is coming.

## Documentation

* [API](api/README.md)
* [Frontend App](app/README.md)

## How to get started

Clone or fork this this repository:

    git clone https://github.com/tanepiper/takeoff.git

Then enter the directory and run:

    > npm install
    > npm run build:dev
    > npm run up:dev

You should now have a server running at [http://localhost](http://localhost). You can access the API via [http://localhost/api](http://localhost/api).

The default user is `admin` and password is `password`.  Do not expect this to be a fully secure environment.

> *Disclaimer: If you build an app with this you wish you deploy, you are responsible for your own security.*

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

|name   |packages  |version|description|
|----   |-------   |-------|-----------|
|api    |node      |8.4.0  |Hapi-powered API that comes pre-build with a user and authentication plugin, uses nodemon for changes.|
|app    |node      |8.4.0  |Webpack/React app that is hot-reloaded on changes|
|db     |postgres  |9.5    |Postgres database|
|server |ngnix     |1.13.3 |Ngnix Proxy|

Run via docker compose, you can begin to add plugins to the Hapi server. You have JWT auth out of the box for endpoints with `admin` and `user` scopes available.

## What you get

Out of the box you get an nodemon-hot-reloading, Hapi-powered API that is already set up to accept plugins.  On the frontend you get a single page hot-reloading React app.  Connecting the two of them is a basic authentication that gives a [JSON Web Token (JWT)](https://jwt.io).

The app has basic login page and when authenticated you get access to the user screen where you can view users, you can also log out.

The basic app shows how you can build your own features.  You get a Postgres database out of the box using Sequelize.  This can easily be replaced with any database or adapter (and I plan to ship more options).

## References

* This document environment was based on the tutorial [Dockerize your app and keep hot-reloading !](https://blog.bam.tech/developper-news/dockerize-your-app-and-keep-hot-reloading) but adding more utilities and making it easier to work as a starter kit.
* [Blog post announcing Takeoff](https://medium.com/@tanepiper/takeoff-a-rapid-development-environment-designed-for-hack-days-9a45ae891366)
* Logo made with [LogoMakr](http://logomakr.com)

## Future Ideas

* Provide other hot loading frontend frameworks (Angular, Vue)
* Improve dashboard of main app
* Improve documentation
* Provide more built in plugins and apps
