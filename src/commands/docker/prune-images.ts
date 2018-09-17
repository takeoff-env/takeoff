import { CommandResult, TakeoffCommand } from 'commands';
import { TakeoffCmdParameters } from 'takeoff';

/**
 * Command for pulling an workspace
 */

export = ({ opts, printMessage, runCommand }: TakeoffCmdParameters): TakeoffCommand => ({
  command: 'pi',
  description: 'Convenience method to prune all images',
  group: 'docker',
  options: [
    {
      description: 'Filter the prune command with expressions (e.g "label=foo")',
      option: '-f, --filter',
    },
  ],
  skipRcCheck: true,
  handler(): CommandResult {
    printMessage(`Pruning Docker Images`);

    // The -f here is to bypass confirmation in docker, the -f in the command itself is for filter
    let cmd = 'docker image prune -f';
    if (opts['f'] || opts['filter']) {
      cmd = `${cmd} --filter ${opts['f'] || opts['filter']}`;
    }

    const runCmd = runCommand(cmd);

    return {
      cmd: runCmd,
      code: runCmd.code,
      fail: `Error pruning Docker Images`,
      success: `Successfully pruned Docker Images`,
    };
  },
});
