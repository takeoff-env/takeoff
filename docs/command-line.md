# Takeoff Command Line

# How Takeoff Command Line works
Takeoff has various commands for creating and managing workspaces and projects. The default commands available are in the following groups:

- Takeoff
- Blueprints
- Docker

By default you do not need to add a group to Takeoff commands (e.g. `takeoff init`), but all other groups are called via a `takeoff group:command` format.

If you are in a workspace it will also load all `.js` and `.ts` files in the `<workspace>/commands` folder.  By creating [custom commands](./custom-commands.md) a developer can add their own workspace commands that are available via `takeoff help` (typing `takeoff` with no command also shows the help).

Most commands need to be run within a workspace where a `.takeoffrc`/`.takeoffrc.json` file exists, but some can be run in any location.

## Initialising a Workspace and Project

### `takeoff init`
Available: Any Folder <br>
Required Arguments: [folder-name]<br>
Optional Arguments: \<blueprint-name>
```bash
takeoff init <folder-name> [blueprint-name] {-b <url> --blueprint-url=<url>} {-d --no-default} {-n "foo" --name="foo"}
```
Command Structure

### Description

<<<<<<< HEAD
This is the initial command to use to create a takeoff workspace.  A workspace consists of blueprints, projects and commands.
=======
The `init` command creates a Takeoff workspace, which is essentially a folder.  Inside itself it contains two folders, `blueprints` and `envs`.
>>>>>>> master

It will run the commands in the blueprint `takeoff.md` file, in order.

<<<<<<< HEAD
When creating an workspace you must pass a folder name that can't currently exist, and you can also specify a blueprint name which will fetch from the cache (e.g. `basic`, `my-cool-blueprint`), or get from a known remote blueprint (such as `takeoff-blueprint-default`).
=======
When creating an workspace you must pass a folder name that can't currently exist, and you can also specify a blueprint name which will fetch from the cache (e.g. `basic`, `my-cool-blueprint`), or get from a known remote blueprint (such as `takeoff-blueprint-basic`).
>>>>>>> master

### Options

- `--blueprint-url` a url to a git repository or local folder containing a blueprint.

- `--no-default` stops the creation of the default workspace and just makes the required folder structure.

- `--name=<name>` changes the name of the project folder. If not passed it will be called `default`

### Example

```bash
takeoff init my-workspace --blueprint-url=https://github.com/takeoff-env/takeoff-blueprint-default
--name=my-cool-project

takeoff init my-workspace --blueprint-url=file://blueprints/my-cool-blueprint
--name=my-cool-project
```

<<<<<<< HEAD
## Workspace Commands

Workspace commands must be run within the folder structure of a workspace.  At the root of the workspace there is a `.takeoffrc` file that defines where blueprints and projects exist.  The format is JSON (and the file can have a `json` extention). From here most commands without arguments or options will run against the `default` project.

### Project Commands

These commands can be run in the root directory with arguments, or within a project directory without arguments (detected by the `takeoff.md`) and are mostly `docker-compose` commands.

#### `takeoff start`

This command starts a docker-compose setup after it has been built (which is done as part of the `default` configutation) and makes the app available on `http://localhost`. If run in a project it will start that project. If a name is specified it starts that project.  If no name is passed it starts `default`. 

You can pass optional services to the `docker-compose` command (e.g. `docker-compose start db`) but you *must* pass the name of the project, even if in the current project folder.
=======
`--no-default` stops the creation of the default workspace and just makes the required folder structure.
>>>>>>> master


<<<<<<< HEAD
=======
These are the commands you can run in the workspace folder.
>>>>>>> master

```bash
takeoff start <workspace> [app]
```

<<<<<<< HEAD
Starts an `workspace`. If you don't pass a name it will start the default workspace. If you pass `app` it will only start that app (e.g. `takeoff start default db`).

```bash
takeoff list
```

Lists the workspaces, versions and apps. More information to be added soon.


=======
Lists the workspaces, versions and apps. More information to be added soon.

```bash
takeoff start <workspace> [app]
```

Starts an `workspace`. If you don't pass a name it will start the default workspace. If you pass `app` it will only start that app (e.g. `takeoff start default db`).
>>>>>>> master

```bash
takeoff stop <workspace>
```

Stops all apps running in an `workspace`.

```bash
takeoff build <workspace>
```

Builds an `workspace` using the docker compose file.

```bash
takeoff destroy <workspace>
```

Destroys an `workspace`. This is non-reversable and will remove the workspace.

```bash
takeoff pull <workspace> [app]
```

Pulls any pre-built images on an `workspace`, or you can specify the `app`.

```bash
takeoff new [project] <blueprint>
```

Creates a new project in the workspace, using the default if no blueprint name specified.

```bash
takeoff blueprint:update [blueprint] <remote> <branch>
```

Update a blueprint, you can specify the remote name and the branch to pull to

```bash
takeoff blueprint:add [blueprint] [git-repo]
```

Add a new blueprint to the blueprint cache from a remote or local git repo

```bash
takeoff docker:pi
```

Helper command to remove ALL docker images, but also support --filter

```bash
takeoff docker:pc
```

Helper command to remove ALL docker containers, but also support --filter

```bash
takeoff docker:pv
```

Helper command to remove ALL docker volumes, but also support --filter
