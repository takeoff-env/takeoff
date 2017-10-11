# Get ready to Takeoff

Takeoff is a toolbox for rapid prototyping applications that uses scripts to make deployment of enironments easy

It is not a framework and is agnostic to any solutions provided to it, but does have some configuration options and conventions it likes.

Under the hood is uses `docker` and `docker-compose` to minimise the hassle out of setting up frontend, backend and database servers.

The core takeoff package is a set of scripts that set up the default takeoff environment. The environments are provided by [Blueprints](docs/blueprints.md), repositories with configurations that Takeoff can use to create your environments.

The core package scripts are currently powered by NPM and there are a set of [available commands](docs/command-line.md) for running the default environment, as well as creating new environments.

Takeoff is designed to cut out those first few crutial hours where you are setting up your project environment, either at a hack day or for a work prototype. The default provided is opinionated but gives you basic authentication and hot reloading apps.  The Wordpress blueprint gives you a PHP and Wordpress environment reading files from your system.

## How to get started

### Installing Docker

This software has currently only been tested on Linux using [Docker Community Edition](https://www.docker.com/community-edition). Once installed you will have the `docker` and `docker-compose` commands.

### Install Takeoff

Installing takeoff is done in 4 easy steps.  Remember you can also clone the repository first to make it easier to manage your own copy.

```bash
> git clone https://github.com/takeoff-env/takeoff.git
> cd takeoff
> npm install
> npm start
```

The above commands will install all the dependencies and have you up and running in minutes.

You should now have a server running at [http://localhost](http://localhost). You can access the API via [http://localhost/api](http://localhost/api).

The default user is `admin` and password is `password`.  Do not expect this to be a fully secure environment.

> *Disclaimer: If you build an app with this you wish you deploy, you are responsible for your own security.*

## Creating new environments

Currently there are two blueprints:

* The default blueprint ([takeoff-blueprint-basic](https://github.com/takeoff-env/takeoff-blueprint-basic) is installed as the default `takeoff` environment in the `env` folder.)

When you want to create a new environment you can type:

```bash
    npm run takeoff:new -- --env=<name of env>
    npm start -- --env=<name of env>
```

This will start up your new environment.

There is also a [Wordpress Blueprint](https://github.com/takeoff-env/takeoff-blueprint-wordpress), you can find out more about installing it via it's documentation

## Platform Support

Currently only Linux is fully tested and supported out the box, but support for other OS is coming (testers and contributors welcome!). There is a page for [Windows Users](docs/windows-setup.md) to provide extra information in the quest to get it working.

## Documentation

* [Command Line Tools](docs/command-line.md)
* [Default Blueprint API](https://github.com/takeoff-env/takeoff-blueprint-basic/blob/master/env/api/README.md)
* [Default Blueprint Frontend App](https://github.com/takeoff-env/takeoff-blueprint-basic/blob/master/env/app/README.md)
* [Wordpress Docs](https://github.com/takeoff-env/takeoff-blueprint-wordpress/blob/master/README.md)

## Architecture

After installing, you will find several folders and files:

```bash
    -|
     |- envs/takeoff # The default environment installed
        |- env # Folders with the source code you can change
            |- api # This is the Hapi API Server
            |- app # This is the frontend app
            |- nginx # Nginx configuration
            |- db # Postgres DB config
        |- docker # This is where all the docker configurations are kept
            |- docker-compose.yml # The glue file for your services
            |- api # This is the Hapi API Server
            |- app # This is the frontend app
            |- nginx # Nginx configuration
            |- db # Postgres DB config
     |- docs # Docs folder, for Github Pages
     |- utilities # Scripts that perform tasks for takeoff via npm commands
     |- README.md # The file you are looking at!
```

## References

* This document environment was based on the tutorial [Dockerize your app and keep hot-reloading !](https://blog.bam.tech/developper-news/dockerize-your-app-and-keep-hot-reloading) but adding more utilities and making it easier to work as a starter kit.
* [Blog post announcing Takeoff](https://medium.com/@tanepiper/takeoff-a-rapid-development-environment-designed-for-hack-days-9a45ae891366)
* Logo made with [LogoMakr](http://logomakr.com)
