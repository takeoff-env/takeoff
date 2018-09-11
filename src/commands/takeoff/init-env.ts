import { DEFAULT_BLUEPRINT_NAME } from '../../lib/constants';
import taskRunner from '../../lib/init-env/task-runner';
import { TakeoffCmdParameters } from 'takeoff';
import { TakeoffCommand } from 'commands';

/**
 * Initialises a new Takeoff Environment.  This will create a cache folder
 * for blueprints and a new projects folder. By default it will create a `default`
 * environment using the blueprint.
 */
export = ({ shell, args, workingDir, opts, printMessage, exitWithMessage }: TakeoffCmdParameters): TakeoffCommand => ({
  command: 'init',
  description: 'Creates a new Takeoff Environment',
  options: [
    {
      option: '-b, --blueprint-url',
      description: 'Pass a git repository as a url for a blueprint to begin the default with',
    },
    {
      option: '-d, --no-default',
      description: 'Does not create a default project',
    },
    {
      option: '-n, --name',
      description: 'Set the name of the initial folder, otherwise it will be "default"',
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
      printMessage(`No environment folder name passed, setting to "takeoff"`);
    }

    printMessage(`Initialising environment ${environmentName}`);

    if (shell.test('-e', environmentName)) {
      return exitWithMessage(`Environment ${environmentName} already exists`, 1);
    }

    const basePath = `${workingDir}/${environmentName}`;

    shell.mkdir('-p', [basePath, `${basePath}/blueprints`, `${basePath}/projects`]);

    shell.touch(`${basePath}/.takeoffrc`);

    if (opts['d'] || opts['no-default']) {
      return exitWithMessage(`Skip creating default project. Done.`, 0);
    }

    const blueprint =
      opts['b'] || opts['blueprint-url'] || `https://github.com/takeoff-env/takeoff-blueprint-${blueprintName}.git`;

    const projectName = opts['n'] || opts['name'] || 'default';

    const blueprintPath = `${basePath}/blueprints/${blueprintName}`;
    const projectDir = `${basePath}/projects/${projectName}`;

    if (!shell.test('-d', blueprintPath)) {
      shell.mkdir('-p', blueprintPath);
      const doClone = shell.exec(`git clone ${blueprint} ${blueprintPath} --depth 1`, {
        slient: opts.v ? false : true,
      });
      if (doClone.code !== 0) {
        return exitWithMessage(`Error cloning ${blueprint}`, 1);
      }
    }

    shell.mkdir('-p', projectDir);
    const doClone = shell.exec(
      `git clone file://${blueprintPath} ${projectDir} && rm -rf ${projectDir}/${blueprintName}/.git `,
      { slient: opts.v ? false : true },
    );
    if (doClone.code !== 0) {
      return exitWithMessage(`Error cloning ${blueprint} to ${projectDir}`, 1, doClone.stdout);
    }

    printMessage(`Initilising Project ${projectName}`);
    await taskRunner(
      {
        cwd: projectDir,
      },
      shell,
    )();
    return exitWithMessage(`Environment provisioned and Project Ready`, 0);
  },
});
