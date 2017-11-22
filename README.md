# Takeoff Rapid Development Toolkit

Takeoff is a toolkit for rapid development and prototyping applications.

*It is not a framework* and is agnostic to any solutions provided to it, but does have some configuration options and conventions it likes.

Takeoff itself is a command line tool installed via `npm` and has a [command line interface](docs/command-line.md) for creating Takeoff environments.  Environments are created based on [Blueprints](docs/blueprints.md).

Blueprints are repositories with some batteries included applications and configurations for containers. Takeoff uses these to build a full working environment in minutes.  A blueprint generally contains a backend component, a frontend, a database and an ingress server.  The default blueprint for Takeoff provides:

* A `node 8` API server powered by Hapi.  Using `node 8` allows the use of `async/await` to make code more readable.  Included in the application is a User system for username/password login and basic user management, 2 levels (admin and user - and easily extendible). There is also a JWT authentication system that gives you control over access to your API endpoints.
* A `React` Frontend with React Router V4, Redux and ReactStrap (Bootstrap 4). The frontend comes with a basic Dashboard layout and homepage.  A login page with some basic validation allows you to log in (the default login is `admin/password` Do not expect this to be a fully secure environment). Once logged in you have a basic user CRUD application to manage users, and a navigation bar that you can customise.

> *Disclaimer: If you build an app with this you wish you deploy, you are responsible for your own security.*

* A Postgres 9 database.  Within the Hapi application, Sequelize is used as the database connection and ORM. Here we can use this to creat migrations and seeds, as well as create simple or complex model types.


Currently, under the hood is uses `docker` and `docker-compose` to minimise the hassle out of setting up frontend, backend and database servers.

Takeoff is designed to cut out those first few crucial hours where you are setting up your project environment, either at a hack day or for a work prototype. The default provided is opinionated but gives you basic authentication and hot reloading apps.  The Wordpress blueprint gives you a PHP and Wordpress environment reading files from your system.

## Open Source Sponsorship

Takeoff is provided as-is for free via Open Source.  If you find Takeoff useful then please click below to help support with basic costs such as the domain name.

<a target='_blank' rel='nofollow' href='https://app.codesponsor.io/link/T2c5nPhtAEam9Py2cKQFyiFS/takeoff-env/takeoff'>
  <img alt='Sponsor' width='888' height='68' src='https://app.codesponsor.io/embed/T2c5nPhtAEam9Py2cKQFyiFS/takeoff-env/takeoff.svg' />
</a>


## How to get started

### Installing Dependencies

This software has some dependencies only been fully tested on Linux using [Docker Community Edition](https://www.docker.com/community-edition).

First install this, Once installed you will have the `docker` and `docker-compose` commands. You also need `git` and `node >= 8.4.0`

### Install Takeoff

Installing takeoff is simple, via NPM.

```bash
npm install -g @takeoff/takeoff
takeoff init <myenv>
cd <myenv>
takeoff start # This starts the default environment container in `envs/default`
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
    takeoff new <environment>
    takeoff start <environment>
```

This will start up your new named environment.

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
     |- envs/default # The default environment installed
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
     |- plugins # Scripts that perform tasks
     |- README.md # The file you are looking at!
```

## References

* This document environment was based on the tutorial [Dockerize your app and keep hot-reloading !](https://blog.bam.tech/developper-news/dockerize-your-app-and-keep-hot-reloading) but adding more utilities and making it easier to work as a starter kit.
* [Blog post announcing Takeoff](https://medium.com/@tanepiper/takeoff-a-rapid-development-environment-designed-for-hack-days-9a45ae891366)
* Logo made with [LogoMakr](http://logomakr.com)
