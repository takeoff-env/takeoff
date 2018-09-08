import { DEFAULT_BLUEPRINT_NAME } from '../../lib/constants';
import taskRunner from '../../lib/init-env/task-runner';
import chalk from 'chalk';

/**
 * Initialises a new Takeoff Environment.  This will create a cache folder
 * for blueprints and a new projects folder. By default it will create a `default`
 * environment using the blueprint.
 */
export = ({
  shell,
  args,
  workingDir,
  opts,
}: TakeoffCmdParameters): TakeoffCommand => ({
  command: 'init',
  description: 'Creates a new Takeoff Environment',
  options: [
    {
      option: '-b, --blueprint-url',
      description:
        'Pass a git repository as a url for a blueprint to begin the default with',
    },
    {
      option: '-d, --no-default',
      description: 'Does not create a default project',
    },
    {
      option: '-n, --name',
      description:
        'Set the name of the initial folder, otherwise it will be "default"',
    },
  ],
  args: '<name> [blueprint-name]',
  group: 'takeoff',
  skipRcCheck: true,
  async handler(): Promise<void> {
    let [environmentName, blueprintName] = args;
    blueprintName = blueprintName || DEFAULT_BLUEPRINT_NAME;

    if (!environmentName) {
      environmentName = 'takeoff';
      shell.echo(
        `${chalk.blueBright(
          `No environment folder name passed, setting to ${environmentName}`,
        )} ${chalk.yellow('takeoff')}`,
      );
    }

    if (shell.test('-e', environmentName)) {
      shell.echo(
        `${chalk.red('Environment')} ${chalk.yellow(
          environmentName,
        )} ${chalk.red('already exists')}`,
      );
      return shell.exit(1);
    }

    const basePath = `${workingDir}/${environmentName}`;

    shell.mkdir('-p', [
      basePath,
      `${basePath}/blueprints`,
      `${basePath}/projects`,
    ]);

    shell.touch(`${basePath}/.takeoffrc`);

    if (opts['d'] || opts['no-default']) {
      shell.echo(`${chalk.yellow('Skipping creating default environment')}`);
      return shell.exit(0);
    }

    const blueprint =
      opts['b'] ||
      opts['blueprint-url'] ||
      `https://github.com/takeoff-env/takeoff-blueprint-${blueprintName}.git`;

    const projectName = opts['n'] || opts['name'] || 'default';

    const blueprintPath = `${basePath}/blueprints/${blueprintName}`;
    const projectDir = `${basePath}/projects/${projectName}`;

    if (!shell.test('-d', blueprintPath)) {
      shell.mkdir('-p', blueprintPath);
      const doClone = shell.exec(
        `git clone ${blueprint} ${blueprintPath} --depth 1`,
        {
          slient: opts.v ? false : true,
        },
      );
      if (doClone.code !== 0) {
        shell.echo(
          `${chalk.red('Error cloning')} ${chalk.yellow(blueprint)}`,
          doClone.stdout,
        );
        shell.exit(1);
      }
    }

    shell.mkdir('-p', projectDir);
    const doClone = shell.exec(
      `git clone file://${blueprintPath} ${projectDir} && rm -rf ${projectDir}/${blueprintName}/.git `,
      { slient: opts.v ? false : true },
    );
    if (doClone.code !== 0) {
      shell.echo(
        `${chalk.red('Error cloning')} ${chalk.yellow(blueprint)}`,
        doClone.stdout,
      );
      shell.exit(1);
    }

    shell.echo(
      `${chalk.magenta('[Takeoff]')} ${chalk.whiteBright(
        'Initilising Project',
      )}`,
    );
    await taskRunner(
      {
        cwd: projectDir,
      },
      shell,
    )();

    shell.echo(`${chalk.magenta('[Takeoff]')} Environment provisioned and Project Ready`);
  },
});
