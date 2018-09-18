import { TakeoffResult, TakeoffCommand } from 'commands';
import { ExitCode, TaskRunnerOptions, Task } from 'task';
import { TakeoffHelpers } from 'helpers';

/**
 * Adds a new blueprint to a takeoff workspace. A blueprint must have a name and be passed a blueprint
 * url or file location
 */
async function handler({
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

const command: TakeoffCommand = {
  args: '<name>',
  command: 'add',
  description:
    'Add a new blueprint. You provide the name of the folder and the location of the git repo you want to clone',
  group: 'blueprint',
  handler,
  options: [
    {
      description: 'Provide a path to a git repo - one of [ git:// | https:// | file:// | ssh://]',
      option: '-b, --blueprint',
    },
  ],
};

export = command;
