import { TakeoffResult, TakeoffCommand, TakeoffHandler } from 'commands';
import { TakeoffHelpers } from 'helpers';
import { ExitCode } from 'task';

import { DEFAULT_BLUEPRINT_NAME, DEFAULT_PROJECT_NAME } from '../../lib/constants';
import createTaskRunner from '../../lib/init-workspace/task-runner';
import createStructure from '../../lib/init-workspace/create-structure';
import { TakeoffCommandDecorator } from '../../decorators/command';

@TakeoffCommandDecorator({
  args: '<name> [blueprint-name]',
  command: 'init',
  description:
    'Creates a new Takeoff Workspace. This will create a new folder that contains an initial blueprint and project based on that blueprint.',
  global: true,
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
})
class Command implements TakeoffHandler {
  async handler({
    args,
    execCommand,
    getProjectDetails,
    opts,
    rcFile,
    pathExists,
    printMessage,
    workingDir,
    shell,
    runCommand,
    silent,
  }: TakeoffHelpers): Promise<TakeoffResult> {
    let [environmentName, blueprintName] = args;
    blueprintName = blueprintName || DEFAULT_BLUEPRINT_NAME;

    if (!environmentName) {
      environmentName = 'takeoff';
      printMessage(`No workspace folder name passed, setting to "takeoff"`);
    }

    if (pathExists(environmentName)) {
      return { code: ExitCode.Error, fail: `Workspace ${environmentName} already exists` };
    }

    const basePath = `${workingDir}/${environmentName}`;

    try {
      printMessage(`Initialising Workspace ${environmentName}`);
      await createStructure(basePath);
    } catch (e) {
      return {
        code: ExitCode.Error,
        fail: `Unable to create takeoff workspace folder ${basePath}`,
        extra: e,
      };
    }

    if (opts['d'] || opts['no-default']) {
      return { code: ExitCode.Success, success: `Skip creating default project. Done.` };
    }

    const blueprint =
      opts['b'] || opts['blueprint-url'] || `https://github.com/takeoff-env/takeoff-blueprint-${blueprintName}.git`;

    const projectName = opts['n'] || opts['name'] || DEFAULT_PROJECT_NAME;

    const blueprintPath = `blueprints/${blueprintName}`;
    const projectDir = `projects/${projectName}`;

    if (!pathExists(`${basePath}/${blueprintPath}`)) {
      shell.mkdir('-p', `${basePath}/${blueprintPath}`);

      const runClone = runCommand(`git clone ${blueprint} ${blueprintPath} --depth 1`, basePath);
      if (runClone.code !== 0) {
        return { extra: runClone.stderr, code: runClone.code, fail: `Error cloning ${blueprint}` };
      }
    }

    shell.mkdir('-p', `${basePath}/${projectDir}`);

    const runLocalClone = runCommand(`git clone file://${basePath}/${blueprintPath} ${projectDir}`, basePath);
    if (runLocalClone.code !== 0) {
      return {
        extra: runLocalClone.stderr,
        code: runLocalClone.code,
        fail: `Error cloning ${blueprintPath} to ${projectDir}`,
      };
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
      success: `Workspace provisioned and Project Ready`,
    };
  }
}

export = Command;
