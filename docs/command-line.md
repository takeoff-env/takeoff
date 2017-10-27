# Takeoff Command Line

Takeoff ships with several commands to use blueprints and environments.

```bash
takeoff init <folder-name> [blueprint-name] --blueprint-url=<url> --no-default
```

The `init` command creates a Takeoff environment.  This contains two folders, `blueprints` and `envs`.  Inside this folder is where you use the `takeoff` commands listed below.  You must pass a name, and you can also specify a blueprint name which will fetch from the cache, or get from a known remote blueprint (such as `takeoff-blueprint-basic`).

You can also pass `--blueprint-url` a url to a git repository which will override and fetch the blueprint.  `--no-default` stops the creation of the default environment and just makes the required folder structure.

```bash
takeoff list
```

Lists the environments, versions and apps.  More information to be added soon.

```bash
takeoff start <environment> [app]
```

Starts an `environment`.  If you pass `app` it will only start that app (e.g. `takeoff start default db`)

```bash
takeoff stop <environment>
```

Stops any apps running in an `environment`

```bash
takeoff build <environment>
```

Builds an `environment` using the docker compose file

```bash
takeoff destroy <environment>
```

Destroys an `environment`.  This is non-reversable and will remove the environment.

```bash
takeoff pull <environment> [app]
```

Pulls any pre-built images on an `environment`, or you can specify the `app`
