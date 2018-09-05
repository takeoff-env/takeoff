import { DEFAULT_BLUEPRINT_NAME } from '../../lib/constants';
import { TakeoffParser } from '../../lib/init-env/takeoff-parser';
import rcCheck from '../../lib/rc-check';

/**
 * Command for creating a new project inside an environment
 */

export = ({ shell, args, workingDir, opts }: TakeoffCmdParameters): TakeoffCommand => ({
  command: 'new',
  description: 'Creates a new project within the current environment',
  args: '<name> [blueprint-name]',
  options: [
    {
      option: '-b, --blueprint-url',
      description: 'Pass a git repository as a url for a blueprint'
    }
  ],
  group: 'takeoff',
  async handler(): Promise<void> {
    rcCheck(shell, workingDir);

    const [folderName, userBlueprintName] = args;

    if (!folderName) {
      shell.echo('You must pass a folder name');
      return shell.exit(1);
    }

    const blueprintName = userBlueprintName || DEFAULT_BLUEPRINT_NAME;

    let cachedBlueprint = shell.test('-d', `${workingDir}/blueprints/${blueprintName}`);

    let blueprint =
      opts['b'] ||
      opts['blueprint-url'] ||
      (cachedBlueprint
        ? `${workingDir}/blueprints/${blueprintName}`
        : `https://github.com/takeoff-env/takeoff-blueprint-${blueprintName}.git`);

    const environment = folderName || 'default';
    const envDir = `${workingDir}/projects/${environment}`;

    shell.mkdir('-p', envDir);
    const doClone = shell.exec(`git clone ${blueprint} ${envDir} --depth 1 && rm -rf ${envDir}/${blueprintName}.git`, {
      slient: opts.v ? false : true
    });
    if (doClone.code !== 0) {
      shell.echo(`Error cloning ${blueprint}`, doClone.stdout);
      shell.exit(1);
    }

    shell.echo(`[Takeoff]: Running Takeoff Config`);
    const parser = new TakeoffParser(
      {
        cwd: envDir
      },
      shell
    );
    await parser.runFile('takeoff');
    shell.echo(`Ran Config`);
  }
});
