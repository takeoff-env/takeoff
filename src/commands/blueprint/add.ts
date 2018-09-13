import { ExitCode } from '@takeoff/takeoff/types/task';
import { TakeoffCommand } from 'commands';
import { TakeoffCmdParameters, TakeoffRcFile } from 'takeoff';

/**
 * Command for pulling an environment
 */

export = ({
  args,
  exitWithMessage,
  opts,
  pathExists,
  printMessage,
  rcFile,
  shell,
  silent,
}: TakeoffCmdParameters): TakeoffCommand => ({
  args: '<name>',
  command: 'add',
  description:
    'Add a new blueprint. You need to provide the name of the folder and the location of the git repo you want to clone',
  group: 'blueprint',
  options: [
    {
      description: 'Provide a path to a git repo - one of [ git:// | https:// | file:// | ssh://]',
      option: '-b, --blueprint',
    },
  ],
  handler(): void {
    const [blueprint]: string[] = args.length > 0 ? args : ['default'];
    const url = opts['b'] || opts['blueprint'];

    printMessage(`Adding Blueprint ${blueprint}`);

    const cwd = `${rcFile.rcRoot}/blueprints`;

    if (pathExists(`${rcFile.rcRoot}/${blueprint}`)) {
      return exitWithMessage(`The blueprint ${blueprint} already exists exist`, ExitCode.Error);
    }

    const runCmd = shell.exec(`git clone ${url} ${blueprint} --depth 1`, {
      cwd,
      silent,
    });

    return exitWithMessage(
      runCmd.code !== 0 ? `Error adding in ${blueprint}.  Use -v to see verbose logs` : `Added blueprint ${blueprint}`,
      runCmd.code,
      silent ? undefined : runCmd.code ? runCmd.stderr : runCmd.stdout,
    );
  },
});
