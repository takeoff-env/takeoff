import { DEFAULT_BLUEPRINT_NAME } from '../../lib/constants';
import taskRunner from '../../lib/init-env/task-runner';
import { TakeoffCmdParameters } from 'takeoff';
import { TakeoffCommand } from 'commands';

/**
 * Command for creating a new project inside an environment
 */

export = ({ shell, args, workingDir, opts, printMessage, exitWithMessage }: TakeoffCmdParameters): TakeoffCommand => ({
  command: 'new',
  description: 'Creates a new project within the current environment',
  args: '<name> [blueprint-name]',
  options: [
    {
      option: '-b, --blueprint-url',
      description: 'Pass a git repository as a url for a blueprint',
    },
  ],
  group: 'takeoff',
  async handler(): Promise<void> {
    const [projectName, userBlueprintName] = args;

    if (!projectName) {
      return exitWithMessage(`You must pass a project name to create a new folder`, 1);
    }

    printMessage(`Creating new project ${projectName}`);

    const blueprintName = userBlueprintName || DEFAULT_BLUEPRINT_NAME;

    let cachedBlueprint = shell.test('-d', `${workingDir}/blueprints/${blueprintName}`);

    let blueprint =
      opts['b'] ||
      opts['blueprint-url'] ||
      (cachedBlueprint
        ? `file://${workingDir}/blueprints/${blueprintName}`
        : `https://github.com/takeoff-env/takeoff-blueprint-${blueprintName}.git`);

    const projectDir = `${workingDir}/projects/${projectName}`;

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

    await taskRunner(
      {
        cwd: projectDir,
      },
      shell,
    )();
    return exitWithMessage(`Project Ready`, 0);
  },
});
