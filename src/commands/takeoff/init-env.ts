import { CommandResult, TakeoffCommand } from 'commands';
import { TakeoffCmdParameters } from 'takeoff';
import { ExitCode } from 'task';

import { DEFAULT_BLUEPRINT_NAME } from '../../lib/constants';
import createTaskRunner from '../../lib/init-env/task-runner';

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
  pathExists,
  printMessage,
  silent,
  runCommand,
}: TakeoffCmdParameters): TakeoffCommand => ({
  args: '<name> [blueprint-name]',
  command: 'init',
  description:
    'Creates a new Takeoff Environment. This will create a new folder that contains an initial blueprint and project based on that blueprint.',
  group: 'takeoff',
  options: [
    {
      description: 'Pass a git repository as a url for a blueprint to begin the default with',
      option: '-b, --blueprint-url',
    },
    {
      description: 'Does not create a default project',
      option: '-d, --no-default',
    },
    {
      description: 'Set the name of the initial folder, otherwise it will be "default"',
      option: '-n, --name',
    },
  ],
  skipRcCheck: true,
  async handler(): Promise<CommandResult> {
    let [environmentName, blueprintName] = args;
    blueprintName = blueprintName || DEFAULT_BLUEPRINT_NAME;

    if (!environmentName) {
      environmentName = 'takeoff';
      printMessage(`No environment folder name passed, setting to "takeoff"`);
    }

    printMessage(`Initialising environment ${environmentName}`);

    if (pathExists(environmentName)) {
      return { code: ExitCode.Error, success: `Environment ${environmentName} already exists` };
    }

    const basePath = `${workingDir}/${environmentName}`;

    shell.mkdir('-p', [basePath, `${basePath}/blueprints`, `${basePath}/projects`, `${basePath}/commands}`]);

    shell.touch(`${basePath}/.takeoffrc`);

    if (opts['d'] || opts['no-default']) {
      return { code: ExitCode.Success, success: `Skip creating default project. Done.` };
    }

    const blueprint =
      opts['b'] || opts['blueprint-url'] || `https://github.com/takeoff-env/takeoff-blueprint-${blueprintName}.git`;

    const projectName = opts['n'] || opts['name'] || 'default';

    const blueprintPath = `blueprints/${blueprintName}`;
    const projectDir = `projects/${projectName}`;

    if (!pathExists(`${basePath}/${blueprintPath}`)) {
      shell.mkdir('-p', `${basePath}/${blueprintPath}`);

      const runClone = runCommand(`git clone ${blueprint} ${blueprintPath} --depth 1`, basePath);
      if (runClone.code !== 0) {
        return { cmd: runClone, code: runClone.code, fail: `Error cloning ${blueprint}` };
      }
    }

    shell.mkdir('-p', `${basePath}/${projectDir}`);

    const runLocalClone = runCommand(`git clone file://${basePath}/${blueprintPath} ${projectDir}`, basePath);
    if (runLocalClone.code !== 0) {
      return { cmd: runLocalClone, code: runLocalClone.code, fail: `Error cloning ${blueprintPath} to ${projectDir}` };
    }

    printMessage(`Initilising Project ${projectName}`);

    const taskRunner = createTaskRunner({
      opts,
      printMessage,
      shell,
      silent,
      workingDir,
    });

    const result = { code: 0 };
    try {
      await taskRunner(null, `${basePath}/${projectDir}`);
    } catch (e) {
      result.code = 1;
    }

    return {
      code: result.code,
      fail: `Error creating new project ${projectName}`,
      success: `Environment provisioned and Project Ready`,
    };
  },
});
