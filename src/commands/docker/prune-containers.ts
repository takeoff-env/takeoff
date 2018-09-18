import { CommandResult, TakeoffCommand } from 'commands';
import { TakeoffCmdParameters } from 'takeoff';

/**
 * Command for pulling an workspace
 */

export = ({ opts, printMessage, runCommand }: TakeoffCmdParameters): TakeoffCommand => ({
  command: 'pc',
  description: 'Convenience method to prune all containers',
  group: 'docker',
  options: [
    {
      description: `Filter the prune command with expressions (e.g "label=foo")`,
      option: '-f, --filter',
    },
  ],
  skipRcCheck: true,
  handler(): CommandResult {
    printMessage(`Pruning Docker Containers`);

    // The -f here is to bypass confirmation in docker, the -f in the command itself is for filter
    let cmd = 'docker container prune -f';
    if (opts['f'] || opts['filter']) {
      cmd = `${cmd} --filter ${opts['f'] || opts['filter']}`;
    }

    const runCmd = runCommand(cmd);

    return {
      code: runCmd.code,
      extra: runCmd.code === 0 ? runCmd.stdout : runCmd.stderr,
      fail: `Error pruning Docker Containers`,
      success: `Successfully pruned Docker Containers`,
    };
  },
});
