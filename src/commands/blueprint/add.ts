import { ExitCode } from '@takeoff/takeoff/types/task';
import { CommandResult, TakeoffCommand } from 'commands';
import { TakeoffCmdParameters } from 'takeoff';

/**
 * Command for pulling an environment
 */

export = ({ args, opts, pathExists, printMessage, rcFile, runCommand }: TakeoffCmdParameters): TakeoffCommand => ({
  args: '<name>',
  command: 'add',
  description:
    'Add a new blueprint. You provide the name of the folder and the location of the git repo you want to clone',
  group: 'blueprint',
  options: [
    {
      description: 'Provide a path to a git repo - one of [ git:// | https:// | file:// | ssh://]',
      option: '-b, --blueprint',
    },
  ],
  handler(): CommandResult {
    const [blueprint]: string[] = args.length > 0 ? args : [];
    const url = opts['b'] || opts['blueprint'];
    if (!blueprint || !url) {
      return { code: ExitCode.Error, fail: 'You must pass a blueprint name and path to clone' };
    }

    printMessage(`Adding Blueprint ${blueprint}`);

    const cwd = `${rcFile.rcRoot}/blueprints`;

    if (pathExists(`${cwd}/${blueprint}`)) {
      return { code: ExitCode.Error, fail: `The blueprint ${blueprint} already exists exist` };
    }

    const runCmd = runCommand(`git clone ${url} ${blueprint} --depth 1`, cwd);

    return {
      cmd: runCmd,
      code: runCmd.code,
      fail: `Error adding ${blueprint}`,
      success: `Successfully added blueprint ${blueprint}`,
    };
  },
});
