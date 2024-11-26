import { TakeoffResult, TakeoffCommand } from 'commands';
import { TakeoffHelpers } from 'helpers';
import { TaskRunnerOptions } from 'task';

/**
 * Command for pulling an workspace
 */

export = class Command implements TakeoffCommand {
  command = 'pv';
  description = 'Convenience method to prune all volumes';
  global = true;
  group = 'docker';
  options = [
    {
      description: 'Filter the prune command with expressions (e.g "label=foo")',
      option: '-f, --filter',
    },
  ];
  async handler({ opts, printMessage, execCommand, workingDir, silent }: TakeoffHelpers): Promise<TakeoffResult> {
    printMessage(`Pruning Docker Volumes`);

    // The -f here is to bypass confirmation in docker, the -f in the command itself is for filter
    let cmd = 'docker volume prune -f';
    if (opts['f'] || opts['filter']) {
      cmd = `${cmd} --filter ${opts['f'] || opts['filter']}`;
    }

    const cmdOptions: TaskRunnerOptions = {
      cwd: workingDir,
      fail: `Error pruning Docker Volumes`,
      silent,
      success: `Successfully pruned Docker Volumes`,
      task: {
        script: cmd,
      },
    };

    return await execCommand(cmdOptions);
  }
};
