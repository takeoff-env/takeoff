import { TakeoffCommand } from 'commands';
import { TakeoffCmdParameters, TakeoffRcFile } from 'takeoff';

import { DEFAULT_BLUEPRINT_NAME } from '../../lib/constants';
import taskRunner from '../../lib/init-env/task-runner';

/**
 * Command for creating a new project inside an environment
 */

export = ({
  shell,
  args,
  workingDir,
  opts,
  printMessage,
  exitWithMessage,
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
      return exitWithMessage(`You must pass a project name to create a new folder`, 1);
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

    const projectDir = `${rcFile.rcRoot}/projects/${projectName}`;

    shell.mkdir('-p', projectDir);
    const doClone = shell.exec(
      `git clone ${blueprint} ${projectDir}${
        cachedBlueprint ? '' : '--depth 1'
      } && rm -rf ${projectDir}/${blueprintName}.git`,
      {
        slient: opts.v ? false : true,
      },
    );

    if (doClone.code !== 0) {
      return exitWithMessage(`You must pass a project name to create a new folder`, 1, doClone.stdout);
    }

    printMessage(`Initilising Project`);

    await taskRunner({ cwd: projectDir }, shell)();

    return exitWithMessage(`Project Ready`, 0);
  },
});
