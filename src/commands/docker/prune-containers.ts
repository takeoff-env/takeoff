import { TakeoffCommand } from 'commands';
import { TakeoffCmdParameters } from 'takeoff';

/**
 * Command for pulling an environment
 */

export = ({
  exitWithMessage,
  opts,
  printMessage,
  shell,
  silent,
}: TakeoffCmdParameters): TakeoffCommand => ({
  command: 'pc',
  description: 'Convenience method to prune all containers',
  group: 'docker',
  options: [
    {
      description: 'Filter the prune command with expressions (e.g "label=foo")',
      option: '-f, --filter',
    },
  ],
  skipRcCheck: true,
  handler(): void {
    printMessage(`Pruning Docker Containers`);

    // The -f here is to bypass confirmation in docker, the -f in the command itself is for filter
    let cmd = 'docker container prune -f';
    if (opts['f'] || opts['filter']) {
      cmd = `${cmd} --filter ${opts['f'] || opts['filter']}`;
    }

    const runCmd = shell.exec(cmd, {
      silent,
    });

    return exitWithMessage(
      runCmd.code !== 0 ? 'Error pruning containers. Use -v to see verbose logs' : 'Docker containers pruned',
      runCmd.code,
      silent ? undefined : runCmd.code ? runCmd.stderr : runCmd.stdout,
    );
  },
});
