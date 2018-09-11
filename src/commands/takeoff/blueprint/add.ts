import { TakeoffCmdParameters } from 'takeoff';
import { TakeoffCommand } from 'commands';
/**
 * Command for pulling an environment
 */

export = ({ shell, args, workingDir, opts, exitWithMessage, printMessage }: TakeoffCmdParameters): TakeoffCommand => ({
  command: 'add',
  description:
    'Add a new blueprint. You need to provide the name of the folder and the location of the git repo you want to clone',
  args: '<name> <blueprint-url>',
  group: 'blueprint',
  handler(): void {
    let [blueprint, newUrl]: string[] = args.length > 0 ? args : ['default'];

    printMessage(`Adding Blueprint ${blueprint}`);

    const blueprintsPath = `${workingDir}/blueprints`;

    if (shell.test('-e', `${blueprintsPath}/${blueprint}`)) {
      return exitWithMessage(`The blueprint ${blueprint} already exists exist`, 1);
    }

    let cmd = `git clone ${newUrl} ${blueprint} --depth 1`;
    const runCmd = shell.exec(cmd, {
      cwd: blueprintsPath,
      slient: opts.v ? false : true,
    });

    if (runCmd.code !== 0) {
      return exitWithMessage(`Error pulling in ${blueprint}.  Use -v to see verbose logs`, 1, runCmd.stdout);
    }
    return exitWithMessage(`Added blueprint ${blueprint}`, 0);
  },
});
