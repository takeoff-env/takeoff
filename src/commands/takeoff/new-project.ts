import { ExitCode } from '@takeoff/takeoff/types/task';
import { TakeoffCommand } from 'commands';
import { TakeoffCmdParameters, TakeoffRcFile } from 'takeoff';

import { DEFAULT_BLUEPRINT_NAME } from '../../lib/constants';
import createTaskRunner from './../../lib/init-env/task-runner';

/**
 * Command for creating a new project inside an environment
 */

export = ({
  shell,
  args,
  pathExists,
  opts,
  printMessage,
  exitWithMessage,
  workingDir,
  runCommand,
  silent,
  rcFile,
}: TakeoffCmdParameters): TakeoffCommand => ({
  args: '<name> [blueprint-name]',
  command: 'new',
  description:
    'Creates a new project within the current environment. By default this will use the default blueprint unless you specify a different name or url.',
  group: 'takeoff',
  options: [
    {
      description: 'Pass a git repository as a url for a blueprint',
      option: '-b, --blueprint-url',
    },
  ],
  async handler(): Promise<void> {
    const [projectName, userBlueprintName] = args;

    if (!projectName) {
      return exitWithMessage(`You must pass a project name to create a new folder`, ExitCode.Error);
    }

    const projectDir = `${rcFile.rcRoot}/projects/${projectName}`;
    if (pathExists(projectDir)) {
      return exitWithMessage(`The project ${projectName} already exists`, ExitCode.Error);
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

    shell.mkdir('-p', projectDir);

    const runCmd = runCommand(
      `git clone ${blueprint} ${projectDir}${cachedBlueprint ? '' : '--depth 1'}`,
      rcFile.rcRoot,
    );

    if (runCmd.code !== 0) {
      return exitWithMessage(
        `Error creating new project ${projectName}.  Use -v to see verbose logs`,
        runCmd.code,
        silent ? undefined : runCmd.code ? runCmd.stderr : runCmd.stdout,
      );
    }

    const taskRunner = createTaskRunner({
      opts,
      printMessage,
      shell,
      silent,
      workingDir,
    });

    try {
      await taskRunner(null, projectDir);
      return exitWithMessage(
        `Successfully created project ${projectName}.`,
        ExitCode.Error,
        silent ? undefined : process.stdout,
      );
    } catch (e) {
      return exitWithMessage(
        `Error creating new project ${projectName}.  Use -v to see verbose logs`,
        ExitCode.Error,
        silent ? undefined : e,
      );
    }
  },
});
