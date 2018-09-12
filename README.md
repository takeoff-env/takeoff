# Takeoff Rapid Development Toolkit

Takeoff is a toolkit for rapid development, allowing you to prototype web applications using it's command line tool.

[Installed via `npm`](https://www.npmjs.com/package/@takeoff/takeoff) you can find a list of [commands](docs/command-line.md) for creating and managing Takeoff environments and projects. Projects are created based on [Blueprints](docs/blueprints.md).

### Install Takeoff

Installing takeoff is simple, via NPM.

```bash
npm install -g @takeoff/takeoff
takeoff init <myenv> # Creates an environment for your projects, if not passed will create a folder called "takeoff"
cd <myenv>
takeoff start # This starts the project in `projects/default`
```

To see how this all works, it's all explained below.

## It starts with a blueprint

Blueprints are repositories with some batteries included applications and configurations for containers. Takeoff uses these to build a full working environment in minutes. A blueprint generally contains a backend component, a frontend, a database and an ingress server.

Currently Takeoff only ships with the default blueprint (but it's relativly easy to create new ones!) called [takeoff-blueprint-basic](https://github.com/takeoff-env/takeoff-blueprint-basic) and it provides:

### Configuring the Blueprint

Configuring the setup of the blueprint application is done via a very easy `takeoff.md` file included in the root directory.

You can find an example file [here](docs/takeoff.md) with details on how it works.

### Default Blueprint

The default blueprint for API comes batteries included:

- A [node](https://nodejs.org) API server powered by [Hapi](https://hapijs.com/) and written in TypeScript. Included in the application is a User system for username/password login and basic user management, 2 levels (admin and user - and easily extendible). There is also a [JSON Web Token](https://jwt.io/) (JWT) authentication system that gives you control over access to your API endpoints.

- An [`Angular`](https://angular.io) Frontend with [Bootstrap 4](https://getbootstrap.com/). The frontend comes with a basic Dashboard layout and homepage. A login page with some basic validation allows you to log in (the default login is `admin/password`). There are some additional components in development, but this is enough to get started on a basic app. 

> Do not expect this to be a fully secure environment. Once logged in you have a basic user CRUD application to manage users, and a navigation bar that you can customise. _Disclaimer: If you build an app with this you wish to deploy, you are responsible for your own security._

- A [MongoDB](https://www.mongodb.com/) database using [Mongoose](https://mongoosejs.com/) to make model development easy. There is a basic user table and seeded admin user provided.  It's easy to add your own models, or update pre-existing ones.

- A [Nginx](https://nginx.org) ingress server, by default running on `port 80` (which means you get http://localhost or http://<your local host name> as your address. If you cannot run on `port 80`, it can be configured in the [docker-compose.yml](https://github.com/takeoff-env/takeoff-blueprint-basic/blob/master/docker/docker-compose.yml#L12) by changing the first number of the pair (e.g `"8080:80"`)

Under the hood it uses `docker` and `docker-compose` to minimise the hassle of setting up frontend, backend and database servers.

### The best part though is of course kept till last.

Using [Docker volumes](https://docs.docker.com/storage/volumes/), the development files for the applications sit on your local computer file system, however the applications run within `docker` and reload on changes. This means you can switch between your code and browser in seconds and see the changes and not have to worry about manually compiling before seeing your changes. Node Modules have their own volume inside the container, so your local ones won't be affected.

On the server side this is accomplished with `nodemon` and on the clientside with `ng serve` using page reloading.

Each container also has an internal volume for `node_modules` so there are no issues with cross-OS compatibility.

If you ever get disconnected from your docker sessions afer starting them up, you can type `takeoff start` again and you will reconnect to see any log output.

## Why Takeoff?

Takeoff is designed to cut out those first few crucial hours where you are setting up your project environment, such as babel and webpack configurations, user authentication or even just selecting a framework. It's perfect for hackdays, rapid prototypes, or teaching new coders by having a pre-configured environment in just 4 simple commands.

It cuts out the scary/annoying bit and gets right to the fun bit!

## System Dependencies

This software has some dependencies, and currently has only been fully tested on Linux using [Docker Community Edition](https://www.docker.com/community-edition).

First install this, once installed you will have the `docker` and `docker-compose` commands. You also need `git` and it's recommended you have `node >= 10.0.0`.

## Up and running

You should now have a server running at [http://localhost](http://localhost). You can access the API via [http://localhost/api](http://localhost/api).

The default blueprint ([takeoff-blueprint-basic](https://github.com/takeoff-env/takeoff-blueprint-basic) is installed as the `default` environment in the `env` and `blueprints` folders.

After installing, you will have this folder structure in your Takeoff environment:

```bash
    -|- .takeoffrc
     |- blueprints/default # The basic blueprint that Takeoff ships
     |- project/default # The default environment installed
        |- takeoff.md
        |- env # Folders with the source code you can change
            |- api # This is the Hapi API Server
            |- frontend-app # Angular application
            |- nginx # Nginx configuration
        |- docker # This is where all the docker configurations are kept
            |- docker-compose.yml # The glue file for your services
            |- api # This is the Hapi API Server
            |- frontend-app # Angular app docker file
            |- nginx # Nginx configuration
```

### Blueprint Cache

When you install a new blueprint, it is cached in the `blueprints` folder; this way when you create a new project below it uses your local copy. If you want to update a blueprint, you can type `takeoff blueprint:update [name]`.  The default one is installed as `basic` for now. You can also install new blueprints via `takeoff blueprint:add [name] [git-url]`.

## Creating new projects

When you want to create a new environment you can type:

```bash
takeoff new [environment] [blueprint-name] --blueprint-url
# Both blueprints here are optional, the first uses the local cache the second specifies a remote
takeoff start [environment]
```

This will start up your new named environment using the `default` blueprint if no name is specified. It's good to make sure you have stopped any other environments running unless you have changed ingress port assignments.

## Custom Commands

In the Takeoff environment you can create a folder called `commands` and place JavaScript and Typescript commands.  Here is a basic JavaScript example:

```js
module.exports = ({
  command, // The command being run as a string
  workingDir, // The directory the command is being run in
  shell,    // An instance of ShellJS
  args, // A object map of key/val args
  opts, // A object map of key/val options
  printMessage, // A function to print to the console, takes a string
  /**
   * A function to print to the console but also exit the shell
   * - 0 for a clean exit
   * - 1 for a error exit
   * You can also pass an optional third string such as runCmd.stdout
   * e.g exitWithMessage('Error Happened`, 1, myCmd.stderr)
   */
  exitWithMessage, 
}) => ({
    /**
     * The below command is available via
     * > takeoff myapp:my-command -w
     */
  command: 'my-command',
  description: 'A custom greeting command',
  args: '[word]',
  options: [{
    option: '-w, --world',
    description: 'Add world to the output'
  }],
  group: 'myapp',
  handler() {
    printMessage(`My script does something`);

    let cmd = 'echo "Hello"';

    const [word] = args.length > 0 ? args: [false];

    if (word) {
      cmd = `${cmd} ${word}`;
    }

    if (opts['w'] || opts['world']) {
      cmd = `${cmd} world`;
    }

    const runCmd = shell.exec(cmd, {
      slient: opts.v ? false : true
    });

    if (runCmd.code !== 0) {
      return exitWithMessage('Error running command.  Use -v to see verbose logs', 1, `${runCmd.stdout} ${runCmd.stderr}`);
    }

    return exitWithMessage('Script exited with no errors', 0);
  }
});
```

This can now be run as `takeoff myapp:my-command dev -w` and will print `Hello dev world`

## Platform Support

Currently only Linux is fully tested and supported out of the box, but support for other OS is coming (testers and contributors welcome!). There is a page for [Windows Users](docs/windows-setup.md) to provide extra information in the quest to get it working.

## Documentation

- [Command Line Tools](docs/command-line.md)
- [Default Blueprint API](https://github.com/takeoff-env/takeoff-blueprint-basic/blob/master/env/api/README.md)
- [Default Blueprint Frontend App](https://github.com/takeoff-env/takeoff-blueprint-basic/blob/master/env/app/README.md)
- [Wordpress Docs](https://github.com/takeoff-env/takeoff-blueprint-wordpress/blob/master/README.md)

## References

- This tool was inspired by [Dockerize your app and keep hot-reloading !](https://blog.bam.tech/developper-news/dockerize-your-app-and-keep-hot-reloading) but adding more utilities and making it easier to work as a starter kit.
- [Blog post announcing Takeoff](https://medium.com/@tanepiper/takeoff-a-rapid-development-environment-designed-for-hack-days-9a45ae891366)
- Logo made with [LogoMakr](http://logomakr.com)
- Takeoff v2 new task runner based on [Maid task runner](https://github.com/egoist/maid)
