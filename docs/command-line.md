# Takeoff Command Line

Once installed you can type `takeoff` to see a full list of commands.

The first command you will likely use is the `init` command.

```bash
takeoff init <folder-name> [blueprint-name] --blueprint-url=<url> --no-default
```

The `init` command creates a Takeoff workspace, which is essentially a folder.  Inside itself it contains two folders, `blueprints` and `envs`.

You run Takeoff commands from the root folder.

When creating an workspace you must pass a folder name that can't currently exist, and you can also specify a blueprint name which will fetch from the cache (e.g. `basic`, `my-cool-blueprint`), or get from a known remote blueprint (such as `takeoff-blueprint-basic`).

You can also pass `--blueprint-url` a url to a git repository or local folder containing a blueprint. For example:

```bash
takeoff init myenv --blueprint-url=https://github.com/takeoff-env/takeoff-blueprint-basic
takeoff init myenv --blueprint-url=file://blueprints/my-cool-blueprint
```

`--no-default` stops the creation of the default workspace and just makes the required folder structure.

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
