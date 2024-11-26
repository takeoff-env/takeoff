import { TakeoffResult, TakeoffCommand } from 'commands';
import { TaskRunnerOptions } from 'task';
import { TakeoffHelpers } from 'helpers';

/**
 * Command for pulling an workspace
 */

export class Command implements TakeoffCommand {
  command = 'pi';
  description = 'Convenience method to prune all images';
  global = true;
  group = 'docker';
  options = [
    {
      description: 'Filter the prune command with expressions (e.g "label=foo")',
      option: '-f, --filter',
    },
  ];
  async handler({ workingDir, silent, execCommand, printMessage, opts }: TakeoffHelpers): Promise<TakeoffResult> {
    printMessage(`Pruning Docker Images`);

    // The -f here is to bypass confirmation in docker, the -f in the command itself is for filter
    let cmd = 'docker image prune -f';
    if (opts['f'] || opts['filter']) {
      cmd = `${cmd} --filter ${opts['f'] || opts['filter']}`;
    }

    const cmdOptions: TaskRunnerOptions = {
      cwd: workingDir,
      fail: `Error pruning Docker Images`,
      silent,
      success: `Successfully pruned Docker Images`,
      task: {
        script: cmd,
      },
    };

    return await execCommand(cmdOptions);
  }
}
