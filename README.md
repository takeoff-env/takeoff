# Takeoff Rapid Development Toolkit

Takeoff is a toolkit for rapid development and prototyping applications.

Takeoff itself is a command line tool [installed via `npm`](https://www.npmjs.com/package/@takeoff/takeoff) and has a [command line interface](docs/command-line.md) for creating and managing Takeoff environments.  Environments are created based on [Blueprints](docs/blueprints.md).

### Install Takeoff

Installing takeoff is simple, via NPM.

```bash
npm install -g @takeoff/takeoff
takeoff init <myenv>
cd <myenv>
takeoff start # This starts the default environment container in `envs/default`
```

To see how this all works, it's all explained below.

## It starts with a blueprint

Blueprints are repositories with some batteries included applications and configurations for containers. Takeoff uses these to build a full working environment in minutes.  A blueprint generally contains a backend component, a frontend, a database and an ingress server.

Currently Takeoff only ships with the default blueprint (but it's relativly easy to create new ones!) called [takeoff-blueprint-basic](https://github.com/takeoff-env/takeoff-blueprint-basic) and it provides:

* A [`node 8`](https://nodejs.org) API server powered by [Hapi](https://hapijs.com/).  Using `node 8` allows the use of `async/await` to make code more readable.  Included in the application is a User system for username/password login and basic user management, 2 levels (admin and user - and easily extendible). There is also a [JSON Web Token](https://jwt.io/) (JWT) authentication system that gives you control over access to your API endpoints.

* A [`React`](https://reactjs.org/) Frontend with [React Router V4](https://github.com/ReactTraining/react-router), [Redux](https://redux.js.org/) and [ReactStrap (Bootstrap 4)](https://reactstrap.github.io/). The frontend comes with a basic Dashboard layout and homepage.  A login page with some basic validation allows you to log in (the default login is `admin/password` Do not expect this to be a fully secure environment). Once logged in you have a basic user CRUD application to manage users, and a navigation bar that you can customise.

> *Disclaimer: If you build an app with this you wish you deploy, you are responsible for your own security.*

* A [Postgres 9](https://www.postgresql.org/) database.  Within the Hapi application, [Sequelize](http://docs.sequelizejs.com/) is used as the database connection and ORM. Here we can use this to create migrations and seeds, as well as create simple or complex model types as you like.  The postgres also comes with a simple configuration file.

* A [Nginx](https://nginx.org) ingress server, by default running on `port 80` (which means you get http://localhost or http://<your local host name> as your address. If you cannot run on `port 80`, it can be configured in the [`docker-compose.yml`](https://github.com/takeoff-env/takeoff-blueprint-basic/blob/master/docker/docker-compose.yml#L12) by changing the first number of the pair (e.g `"8080:80"`)

Under the hood is uses `docker` and `docker-compose` to minimise the hassle out of setting up frontend, backend and database servers (support for minikube is coming soon). 

### The best part though is of course kept till last.

Using Docker volumes, the development files for the applications sit on your local computer file system, however the applications run within `docker` and hot reload on changes.  This means you can switch between your code and browser in seconds and see the changes and not have to worry about manually compiling before seeing your changes.  On the server side this is accomplished with `nodemon` and on the clientside with `webpack` using hot reloading, so in most cases you don't need to refresh the browser at all.

If you ever get disconnected from your docker sessions afer starting them up, you can type `takeoff start` again and you will reconnect to see any log output.

## Why Takeoff?

Takeoff is designed to cut out those first few crucial hours where you are setting up your project environment, such as babel and webpack configurations, user authentication or even just selecting a framework.  It's perfect for hackdays, rapid prototypes, teaching new coders by having a pre-configured environment in just 4 simple commands.

It cut out the scary/annoying bit and gets right to the fun bit!

## Open Source Sponsorship

Takeoff is provided as-is for free via Open Source.  If you find Takeoff useful then please click below to help support with basic costs such as the domain name.

<a target='_blank' rel='nofollow' href='https://app.codesponsor.io/link/T2c5nPhtAEam9Py2cKQFyiFS/takeoff-env/takeoff'>
  <img alt='Sponsor' width='888' height='68' src='https://app.codesponsor.io/embed/T2c5nPhtAEam9Py2cKQFyiFS/takeoff-env/takeoff.svg' />
</a>

## System Dependencies

This software has some dependencies, and currently has only been fully tested on Linux using [Docker Community Edition](https://www.docker.com/community-edition).

First install this, Once installed you will have the `docker` and `docker-compose` commands. You also need `git` and `node >= 8.4.0`.

## Up and running

You should now have a server running at [http://localhost](http://localhost). You can access the API via [http://localhost/api](http://localhost/api).

After installing, you will this folder structure in your Takeoff environment

```bash
    -|
     |- blueprints/basic # The basic blueprint that Takeoff ships
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
```

### Blueprint Cache

When you install a new blueprint, it is cached in the `blueprints` folder; this way when you create a new environment below it uses your local copy.  If you want to update a blueprint, for now go into the folder and type `git pull origin master`. A command will be coming for this soon.

## Creating new environments

Unofficially there are two blueprints:

* The default blueprint ([takeoff-blueprint-basic](https://github.com/takeoff-env/takeoff-blueprint-basic) is installed as the `default` environment in the `env` folder and `basic` in the `blueprints` folder.

When you want to create a new environment you can type:

```bash
    takeoff new <environment>
    takeoff start <environment>
```

This will start up your new named environment using the `basic` blueprint.  Make sure you have stopped any other environments running unless you have changed ingress port assignments.

There is also a [Wordpress Blueprint](https://github.com/takeoff-env/takeoff-blueprint-wordpress), you can find out more about installing it via it's documentation (it may currently be broken, and I want to make this into a more general PHP blueprint anyway).

## Platform Support

Currently only Linux is fully tested and supported out the box, but support for other OS is coming (testers and contributors welcome!). There is a page for [Windows Users](docs/windows-setup.md) to provide extra information in the quest to get it working.

## Documentation

* [Command Line Tools](docs/command-line.md)
* [Default Blueprint API](https://github.com/takeoff-env/takeoff-blueprint-basic/blob/master/env/api/README.md)
* [Default Blueprint Frontend App](https://github.com/takeoff-env/takeoff-blueprint-basic/blob/master/env/app/README.md)
* [Wordpress Docs](https://github.com/takeoff-env/takeoff-blueprint-wordpress/blob/master/README.md)


## References

* This document environment was based on the tutorial [Dockerize your app and keep hot-reloading !](https://blog.bam.tech/developper-news/dockerize-your-app-and-keep-hot-reloading) but adding more utilities and making it easier to work as a starter kit.
* [Blog post announcing Takeoff](https://medium.com/@tanepiper/takeoff-a-rapid-development-environment-designed-for-hack-days-9a45ae891366)
* Logo made with [LogoMakr](http://logomakr.com)
