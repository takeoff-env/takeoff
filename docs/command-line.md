# Takeoff Command Line

Once installed you can type `takeoff` to see a full list of commands.

The first command you will likely use is the `init` command.

```bash
takeoff init <folder-name> [blueprint-name] --blueprint-url=<url> --no-default
```

The `init` command creates a Takeoff environment, which is essentially a folder.  Inside itself it contains two folders, `blueprints` and `envs`.

You run Takeoff commands from the root folder.


When creating an environment you must pass a folder name that can't currently exist, and you can also specify a blueprint name which will fetch from the cache (e.g. `basic`, `my-coolblue-print`), or get from a known remote blueprint (such as `takeoff-blueprint-basic`).

You can also pass `--blueprint-url` a url to a git repository or local folder containing a blueprint.  For example:

```bash
takeoff init myenv --blueprint-url=https://github.com/takeoff-env/takeoff-blueprint-basic
takeoff init myenv --blueprint-url=file://blueprints/my-cool-blueprint
```

`--no-default` stops the creation of the default environment and just makes the required folder structure.

## Folder Commands

These are the commands you can run in the environment folder.

```bash
takeoff list
```

Lists the environments, versions and apps.  More information to be added soon.

```bash
takeoff start <environment> [app]
```

Starts an `environment`  If you don't pass a name it will start the default environment.  If you pass `app` it will only start that app (e.g. `takeoff start default db`).

```bash
takeoff stop <environment>
```

Stops all apps running in an `environment`.

```bash
takeoff build <environment>
```

Builds an `environment` using the docker compose file.

```bash
takeoff destroy <environment>
```

Destroys an `environment`.  This is non-reversable and will remove the environment.

```bash
takeoff pull <environment> [app]
```

Pulls any pre-built images on an `environment`, or you can specify the `app`.
