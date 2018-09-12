import { ExitCode } from '@takeoff/takeoff/types/task';
import { TakeoffCommand } from 'commands';
import { TakeoffCmdParameters, TakeoffRcFile } from 'takeoff';
import { DEFAULT_BLUEPRINT_NAME } from '../../lib/constants';

/**
 * Command for pulling an environment
 */

export = ({
  args,
  exitWithMessage,
  printMessage,
  rcFile,
  shell,
  silent,
}: TakeoffCmdParameters): TakeoffCommand => ({
  args: '<name> [remote] [branch]',
  command: 'update',
  description:
    'Updates a named blueprint. Can optionally pass a remote name and branch name, otherwise the default is "origin" and "master"',
  group: 'blueprint',
  handler(): void {
    const [blueprint, ...rest]: string[] = args.length > 0 ? args : [DEFAULT_BLUEPRINT_NAME];

    const remote = rest[0] ? rest[0] : 'origin';
    const branch = rest[1] ? rest[1] : 'master';

    printMessage(`Updating Blueprint ${blueprint} on ${branch} from ${remote}`);

    const cwd = `${rcFile.rcRoot}/blueprints/${blueprint}`;

    if (!shell.test('-e', cwd)) {
      return exitWithMessage(`The blueprint ${blueprint} doesn't exist`, ExitCode.Error);
    }

    const runCmd = shell.exec(`git pull ${remote} ${branch}`, {
      cwd,
      silent,
    });

    return exitWithMessage(
      runCmd.code !== 0
        ? `Error pulling in ${blueprint}.  Use -v to see verbose logs`
        : `Updated blueprint ${blueprint}`,
      runCmd.code,
      silent ? undefined : runCmd.code ? runCmd.stderr : runCmd.stdout,
    );
  },
});
