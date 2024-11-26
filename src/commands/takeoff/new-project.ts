import { TakeoffResult, TakeoffCommand } from 'commands';
import { TakeoffHelpers } from 'takeoff';
import { ExitCode } from 'task';

import { DEFAULT_BLUEPRINT_NAME } from '../../lib/constants';
import createTaskRunner from './../../lib/init-env/task-runner';

/**
 * Command for creating a new project inside an workspace
 */

export = ({
  shell,
  args,
  pathExists,
  opts,
  printMessage,
  workingDir,
  runCommand,
  silent,
  rcFile,
}: TakeoffHelpers): TakeoffCommand => ({
  args: '<name> [blueprint-name]',
  command: 'new',
  description:
    'Creates a new project within the current workspace. By default this will use the default blueprint unless you specify a different name or url.',
  group: 'takeoff',
  options: [
    {
      description: 'Pass a git repository as a url for a blueprint',
      option: '-b, --blueprint-url',
    },
  ],
  async handler(): Promise<TakeoffResult> {
    const [projectName, userBlueprintName] = args;

    if (!projectName) {
      return { code: ExitCode.Error, fail: 'You must pass a project name to create a new folder' };
    }

    const projectDir = `projects/${projectName}`;
    if (pathExists(`${rcFile.rcRoot}/${projectDir}`)) {
      return { code: ExitCode.Error, fail: `The project ${projectName} already exists` };
    }

    printMessage(`Creating new project ${projectName}`);

    const blueprintName = userBlueprintName || DEFAULT_BLUEPRINT_NAME;

    const cachedBlueprint = shell.test('-d', `${rcFile.rcRoot}/blueprints/${blueprintName}`);

    const blueprint =
      opts['b'] ||
      opts['blueprint-url'] ||
      (cachedBlueprint
        ? `file://${rcFile.rcRoot}/blueprints/${blueprintName}`
        : `https://github.com/takeoff-env/takeoff-blueprint-${blueprintName}.git`);

    shell.mkdir('-p', `${rcFile.rcRoot}/${projectDir}`);

    const runCmd = runCommand(
      `git clone ${blueprint} ${projectDir}${cachedBlueprint ? '' : '--depth 1'}`,
      rcFile.rcRoot,
    );

    if (runCmd.code !== 0) {
      return { extra: runCmd.stderr, code: runCmd.code, fail: `Error creating new project ${projectName}` };
    }

    const taskRunner = createTaskRunner({
      opts,
      printMessage,
      shell,
      silent,
      workingDir,
    });

    const result = { code: 0 };
    try {
      await taskRunner(null, `${rcFile.rcRoot}/${projectDir}`);
    } catch (e) {
      result.code = 1;
    }

    return {
      code: result.code,
      fail: `Error creating new project ${projectName}`,
      success: `Successfully created project ${projectName}`,
    };
  },
});
