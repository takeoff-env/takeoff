import { TakeoffCommand } from 'commands';
import { TakeoffCmdParameters } from 'takeoff';

/**
 * Command for pulling an environment
 */

export = ({ shell, args, workingDir, opts, exitWithMessage, printMessage }: TakeoffCmdParameters): TakeoffCommand => ({
  args: '<name> <blueprint-url>',
  command: 'add',
  description:
    'Add a new blueprint. You need to provide the name of the folder and the location of the git repo you want to clone',
  group: 'blueprint',
  handler(): void {
    const [blueprint, newUrl]: string[] = args.length > 0 ? args : ['default'];

    printMessage(`Adding Blueprint ${blueprint}`);

    const blueprintsPath = `${workingDir}/blueprints`;

    if (shell.test('-e', `${blueprintsPath}/${blueprint}`)) {
      return exitWithMessage(`The blueprint ${blueprint} already exists exist`, 1);
    }

    const runCmd = shell.exec(`git clone ${newUrl} ${blueprint} --depth 1`, {
      cwd: blueprintsPath,
      slient: opts.v ? false : true,
    });

    if (runCmd.code !== 0) {
      return exitWithMessage(`Error pulling in ${blueprint}.  Use -v to see verbose logs`, 1, runCmd.stdout);
    }
    return exitWithMessage(`Added blueprint ${blueprint}`, 0);
  },
});
