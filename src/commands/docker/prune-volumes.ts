import { TakeoffCommand } from 'commands';
import { TakeoffCmdParameters } from 'takeoff';

/**
 * Command for pulling an environment
 */

export = ({ exitWithMessage, opts, printMessage, shell, silent }: TakeoffCmdParameters): TakeoffCommand => ({
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
  handler(): void {
    printMessage(`Pruning Docker Volumes`);

    // The -f here is to bypass confirmation in docker, the -f in the command itself is for filter
    let cmd = 'docker volume prune -f';
    if (opts['f'] || opts['filter']) {
      cmd = `${cmd} --filter ${opts['f'] || opts['filter']}`;
    }

    const runCmd = shell.exec(cmd, {
      silent,
    });

    return exitWithMessage(
      runCmd.code !== 0 ? 'Error pruning volumes. Use -v to see verbose logs' : 'Docker volumes pruned',
      runCmd.code,
      silent ? undefined : runCmd.code ? runCmd.stderr : runCmd.stdout,
    );
  },
});
