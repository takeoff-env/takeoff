import { TakeoffCommand, TakeoffResult } from 'commands';
import { ExitCode, TaskRunnerOptions } from 'task';
import { DEFAULT_BLUEPRINT_NAME } from '../../lib/constants';
import { TakeoffHelpers } from 'helpers';

export = class Command implements TakeoffCommand {
  args = '<name> [remote] [branch]';
  command = 'update';
  description =
    'Updates a named blueprint. Can optionally pass a remote name and branch name, otherwise the default is "origin" and "master"';
  group = 'blueprint';

  async handler({
    args,
    pathExists,
    printMessage,
    rcFile,
    silent,
    execCommand,
  }: TakeoffHelpers): Promise<TakeoffResult> {
    const [blueprint, ...rest]: string[] = args.length > 0 ? args : [DEFAULT_BLUEPRINT_NAME];

    const remote = rest[0] ? rest[0] : 'origin';
    const branch = rest[1] ? rest[1] : 'master';

    printMessage(`Updating Blueprint ${blueprint} on ${branch} from ${remote}`);

    const blueprintDir = `${rcFile.rcRoot}/blueprints/${blueprint}`;

    if (!pathExists(blueprintDir)) {
      return { code: ExitCode.Error, fail: `The blueprint ${blueprint} does not exist` };
    }

    const cmdOptions: TaskRunnerOptions = {
      cwd: blueprintDir,
      fail: `Error updating ${blueprint}`,
      silent,
      success: `Successfully updated blueprint ${blueprint} (${remote} => ${branch})`,
      task: {
        script: `git pull ${remote} ${branch}`,
      },
    };

    return await execCommand(cmdOptions);
  }
};
