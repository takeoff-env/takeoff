import { DEFAULT_BLUEPRINT_NAME } from '../../lib/constants';
import { TakeoffParser } from '../../lib/init-env/takeoff-parser';

/**
 * Initialises a new Takeoff Environment.  This will create a cache folder
 * for blueprints and a new projects folder. By default it will create a `default`
 * environment using the blueprint.
 */
export = ({ shell, args, workingDir, opts }: TakeoffCmdParameters): TakeoffCommand => ({
  command: 'init',
  description: 'Creates a new Takeoff Environment',
  options: [
    {
      option: '-b, --blueprint-url',
      description: 'Pass a git repository as a url for a blueprint to begin the default with'
    },
    {
      option: '-d, --no-default',
      description: 'Does not create a default project'
    },
    {
      option: '-n, --name',
      description: 'Set the name of the initial folder, otherwise it will be "default"'
    }
  ],
  args: '<name> [blueprint-name]',
  group: 'takeoff',
  async handler(): Promise<void> {
    let [folderName, blueprintName] = args;

    if (!folderName) {
      folderName = 'takeoff';
      shell.echo(`No folder name passed, setting to default "takeoff"`);
    }

    if (shell.test('-e', folderName)) {
      shell.echo(`Environment ${folderName} already exists`);
      return shell.exit(1);
    }

    blueprintName = blueprintName || DEFAULT_BLUEPRINT_NAME;

    const basePath = `${workingDir}/${folderName}`;

    shell.echo(`Creating folder ${folderName}`);
    shell.mkdir('-p', [basePath, `${basePath}/blueprints`, `${basePath}/projects`]);

    shell.touch(`${basePath}/.takeoffrc`);

    if (opts['d'] || opts['no-default']) {
      shell.echo('Skipping creating default environment');
      return shell.exit(0);
    }

    const blueprint =
      opts['b'] || opts['blueprint-url'] || `https://github.com/takeoff-env/takeoff-blueprint-${blueprintName}.git`;
    const environment = opts['n'] || opts['name'] || 'default';

    const blueprintPath = `${basePath}/blueprints/${blueprintName}`;
    const envDir = `${basePath}/projects/${environment}`;

    if (!shell.test('-d', blueprintPath)) {
      shell.mkdir('-p', blueprintPath);
      const doClone = shell.exec(`git clone ${blueprint} ${blueprintPath} --depth 1`, {
        slient: opts.v ? false : true
      });
      if (doClone.code !== 0) {
        shell.echo(`Error cloning ${blueprint}`, doClone.stdout);
        shell.exit(1);
      }
      shell.echo(`Cloned ${blueprint} to cache`);
    }

    shell.mkdir('-p', envDir);
    const doClone = shell.exec(`git clone ${blueprintPath} ${envDir} --depth 1 && rm -rf ${envDir}/${blueprintName}/.git `, { slient: opts.v ? false : true });
    if (doClone.code !== 0) {
      shell.echo(`Error cloning ${blueprint}`, doClone.stdout);
      shell.exit(1);
    }

    shell.echo(`[Takeoff]: Initilising Project`);
    const parser = new TakeoffParser(
      {
        cwd: envDir
      },
      shell
    );
    await parser.runFile('takeoff');
    shell.echo(`[Takeoff]: Project Ready`);
  }
});
