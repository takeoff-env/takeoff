import { CommandResult, TakeoffCommand } from 'commands';
import { TakeoffCmdParameters } from 'takeoff';
import { ExitCode } from 'task';
import { DEFAULT_BLUEPRINT_NAME } from '../../lib/constants';

/**
 * Command for pulling an workspace
 */

export = ({ args, pathExists, printMessage, rcFile, runCommand }: TakeoffCmdParameters): TakeoffCommand => ({
  args: '<name> [remote] [branch]',
  command: 'update',
  description:
    'Updates a named blueprint. Can optionally pass a remote name and branch name, otherwise the default is "origin" and "master"',
  group: 'blueprint',
  handler(): CommandResult {
    const [blueprint, ...rest]: string[] = args.length > 0 ? args : [DEFAULT_BLUEPRINT_NAME];

    const remote = rest[0] ? rest[0] : 'origin';
    const branch = rest[1] ? rest[1] : 'master';

    printMessage(`Updating Blueprint ${blueprint} on ${branch} from ${remote}`);

    const cwd = `${rcFile.rcRoot}/blueprints/${blueprint}`;

    if (!pathExists(cwd)) {
      return { code: ExitCode.Error, fail: `The blueprint ${blueprint} does not exist` };
    }

    const runCmd = runCommand(`git pull ${remote} ${branch}`, cwd);

    return {
      cmd: runCmd,
      code: runCmd.code,
      fail: `Error updating ${blueprint}`,
      success: `Successfully updated blueprint ${blueprint} (${remote} => ${branch})`,
    };
  },
});
