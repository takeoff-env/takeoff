import { TakeoffResult, TakeoffCommand } from 'commands';
import { TaskRunnerOptions } from 'task';
import { TakeoffHelpers } from 'helpers';

export = class Command implements TakeoffCommand {
  command = 'pc';
  description = 'Convenience method to prune all containers';
  global = true;
  group = 'docker';
  options = [
    {
      description: `Filter the prune command with expressions (e.g "label=foo")`,
      option: '-f, --filter',
    },
  ];

  async handler({ opts, printMessage, silent, execCommand, workingDir }: TakeoffHelpers): Promise<TakeoffResult> {
    printMessage(`Pruning Docker Containers`);

    // The -f here is to bypass confirmation in docker, the -f in the command itself is for filter
    let cmd = 'docker container prune -f';
    if (opts['f'] || opts['filter']) {
      cmd = `${cmd} --filter ${opts['f'] || opts['filter']}`;
    }

    const cmdOptions: TaskRunnerOptions = {
      cwd: workingDir,
      fail: `Error pruning Docker Containers`,
      silent,
      success: `Successfully pruned Docker Containers`,
      task: {
        script: cmd,
      },
    };

    return await execCommand(cmdOptions);
  }
};
