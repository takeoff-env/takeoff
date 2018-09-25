import { TakeoffResult, TakeoffCommand, TakeoffHandler } from 'commands';
import { ExitCode, TaskRunnerOptions } from 'task';
import { TakeoffHelpers } from 'helpers';
import { TakeoffCommandDecorator } from '../../decorators/command';

@TakeoffCommandDecorator({
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
})
class Command implements TakeoffHandler {
  async handler({
    args,
    opts,
    pathExists,
    printMessage,
    rcFile,
    silent,
    execCommand,
  }: TakeoffHelpers): Promise<TakeoffResult> {
    const [blueprint]: string[] = args.length > 0 ? args : [];
    const url = opts['b'] || opts['blueprint'];

    if (!blueprint || !url) {
      return { code: ExitCode.Error, fail: 'You must pass a blueprint name and path to clone' };
    }

    const blueprintDir = `${rcFile.rcRoot}/blueprints`;
    if (pathExists(`${blueprintDir}/${blueprint}`)) {
      return { code: ExitCode.Error, fail: `The blueprint ${blueprint} already exists exist` };
    }

    printMessage(`Adding Blueprint ${blueprint}`);

    const cmdOptions: TaskRunnerOptions = {
      cwd: blueprintDir,
      fail: `Error adding ${blueprint}`,
      silent,
      success: `Successfully added blueprint ${blueprint}`,
      task: {
        script: `git clone ${url} ${blueprint} --depth 1`,
      },
    };

    return await execCommand(cmdOptions);
  }
}

export = Command;
