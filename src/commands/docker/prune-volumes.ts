import { TakeoffResult, TakeoffCommand } from 'commands';
import { TakeoffHelpers } from 'takeoff';

/**
 * Command for pulling an workspace
 */

export = ({ opts, printMessage, runCommand }: TakeoffHelpers): TakeoffCommand => ({
  command: 'pv',
  description: 'Convenience method to prune all volumes',
  group: 'docker',
  options: [
    {
      description: 'Filter the prune command with expressions (e.g "label=foo")',
      option: '-f, --filter',
    },
  ],
  skipRcCheck: true,
  handler(): TakeoffResult {
    printMessage(`Pruning Docker Volumes`);

    // The -f here is to bypass confirmation in docker, the -f in the command itself is for filter
    let cmd = 'docker volume prune -f';
    if (opts['f'] || opts['filter']) {
      cmd = `${cmd} --filter ${opts['f'] || opts['filter']}`;
    }

    const runCmd = runCommand(cmd);

    return {
      code: runCmd.code,
      extra: runCmd.code === 0 ? runCmd.stdout : runCmd.stderr,
      fail: `Error pruning Docker Volumes`,
      success: `Successfully pruned Docker Volumes`,
    };
  },
});
