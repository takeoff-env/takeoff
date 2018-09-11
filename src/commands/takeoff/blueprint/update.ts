import { TakeoffCmdParameters } from 'takeoff';
import { TakeoffCommand } from 'commands';

/**
 * Command for pulling an environment
 */

export = ({ shell, args, workingDir, opts, exitWithMessage, printMessage }: TakeoffCmdParameters): TakeoffCommand => ({
  command: 'update',
  description:
    'Updates a named blueprint. Can optionally pass a remote name and branch name, otherwise the default is "origin" and "master"',
  args: '<name> [remote] [branch]',
  group: 'blueprint',
  handler(): void {
    let [blueprint, remote, branch]: string[] = args.length > 0 ? args : ['basic'];

    if (!remote) {
      remote = 'origin';
    }
    if (!branch) {
      branch = 'master';
    }

    printMessage(`Updating Blueprint ${blueprint} on ${branch} from ${remote}`);

    const envDir = `${workingDir}/blueprints/${blueprint}`;

    if (!shell.test('-e', envDir)) {
      return exitWithMessage(`The blueprint ${blueprint} doesn't exist`, 1);
    }

    let cmd = `git pull ${remote} ${branch}`;
    const runCmd = shell.exec(cmd, {
      cwd: envDir,
      slient: opts.v ? false : true,
    });

    if (runCmd.code !== 0) {
      return exitWithMessage(`Error pulling in ${blueprint}.  Use -v to see verbose logs`, 1, runCmd.stdout);
    }
    return exitWithMessage(`Updated blueprint ${blueprint}`, 0);
  },
});
