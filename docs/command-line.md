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

This is the initial command to use to create a takeoff workspace.  A workspace consists of blueprints, projects and commands.

It will run the commands in the blueprint `takeoff.md` file, in order.

When creating an workspace you must pass a folder name that can't currently exist, and you can also specify a blueprint name which will fetch from the cache (e.g. `basic`, `my-cool-blueprint`), or get from a known remote blueprint (such as `takeoff-blueprint-default`).

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

## Folder Commands

These are the commands you can run in the workspace folder.

```bash
takeoff list
```

Lists the workspaces, versions and apps. More information to be added soon.

```bash
takeoff start <workspace> [app]
```

Starts an `workspace`. If you don't pass a name it will start the default workspace. If you pass `app` it will only start that app (e.g. `takeoff start default db`).

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
