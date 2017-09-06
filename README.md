# Takeoff: Rapid Prototyping Environment

<img src="docs/assets/logo.png" width="200px" align="left" style="margin-right:20px; margin-bottom:20px;" />

Takeoff is a toolbox for rapid prototyping applications.

It is not a framework and is in fact agnostic to any solutions provided to it. However to provide the ability to rapidly develop applications it ships with some opinionated defaults.

Under the hood is uses `docker` and `docker-compose` to minimise the hassle out of setting up frontend, backend and database servers. Within seconds you'll have a hot-reloading frontend and backend which allows you to make changes without the need to usually restart the server.

The default configuration ships with:

* A plugin-based API server powered by Hapi
* A hot-reloading React frontend including React Router v4 and Redux
* A Postgres database and a Sequelize adapter available in the API to interact with it
* A Ngnix server proxying all requests via port 80.

With the API you also get out of the box user management and authentication, and on the frontend a default login page and API middlware to use a [JSON Web Token (JWT)](https://jwt.io) to provide authenticated access for your endpoints with `admin` and `user` scopes available . Using the documentation to can then extend these with your own functionality.

There are a set of [available commands](docs/command-line.md) to help make the toolbox cross-platform.  These are in the process of being integrated and documented.

Currently only Linux is fully tested and supported out the box, but support for other OS is coming (testers and contributors welcome!). There is a page for [Windows Users](docs/windows-setup.md) to provide extra information in the quest to get it working.

## Documentation

* [Command Line Tools](docs/command-line.md)
* [API](api/README.md)
* [Frontend App](app/README.md)

## How to get started

### Installing Docker

This software has currently only been tested on Linux using [Docker Community Edition](https://www.docker.com/community-edition). Once installed you will have the `docker` and `docker-compose` commands.

### Install Takeoff

Installing takeoff is done in 4 easy steps.  Remember you can also clone the repository first to make it easier to manage your own copy.

```bash
> git clone https://github.com/tanepiper/takeoff.git
> cd takeoff
> npm install
> npm start
```

The above commands will install all the dependencies and have you up and running in minutes.

You should now have a server running at [http://localhost](http://localhost). You can access the API via [http://localhost/api](http://localhost/api).

The default user is `admin` and password is `password`.  Do not expect this to be a fully secure environment.

> *Disclaimer: If you build an app with this you wish you deploy, you are responsible for your own security.*

## Architecture

You will find several folders and files:

```bash
    -|
     |- api # This is the Hapi API Server
     |- app # This is the frontend app
     |- docker # This is where all the docker configurations are kept
     |- docs # Docs folder, for Github Pages
     |- nginx # Nginx configuration
     |- scripts # Scripts, will be deprecated due to only supporting linux
     |- utilities # Will replace scripts
     |- README.md # The file you are looking at!
```

Inside the docker folder and several docker files which create the environments.

The default environments are listed below with the main environments from their docker files.  Full components will be listed soon.

|name   |packages  |version|description|
|----   |-------   |-------|-----------|
|api    |node      |8.4.0  |Hapi-powered API that comes pre-build with a user and authentication plugin, uses nodemon for changes.|
|app    |node      |8.4.0  |Webpack/React app that is hot-reloaded on changes|
|db     |postgres  |9.5    |Postgres database|
|server |ngnix     |1.13.3 |Ngnix Proxy|

Run via docker compose, you can begin to add plugins to the Hapi server.  You can easily add your own docker images for other services such as redis, memcache, mysql, etc.

## References

* This document environment was based on the tutorial [Dockerize your app and keep hot-reloading !](https://blog.bam.tech/developper-news/dockerize-your-app-and-keep-hot-reloading) but adding more utilities and making it easier to work as a starter kit.
* [Blog post announcing Takeoff](https://medium.com/@tanepiper/takeoff-a-rapid-development-environment-designed-for-hack-days-9a45ae891366)
* Logo made with [LogoMakr](http://logomakr.com)

## Future Ideas

* Provide other hot loading frontend frameworks (Angular, Vue)
* Improve dashboard of main app
* Provide more built in plugins and apps
