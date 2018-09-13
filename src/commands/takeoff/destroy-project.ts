import { CommandResult, TakeoffCommand } from 'commands';
import { TakeoffCmdParameters } from 'takeoff';
import { ExitCode } from 'task';

/**
 * Destroys an project in a non-reversable way
 */
export = ({
  shell,
  args,
  opts,
  rcFile,
  pathExists,
  printMessage,
  runCommand,
}: TakeoffCmdParameters): TakeoffCommand => ({
  args: '<name>',
  command: 'destroy',
  description:
    'Destroys the docker containers for a project. Can also optionally remove the folder, this operation cannot be reversed.',
  group: 'takeoff',
  options: [
    {
      description: 'Also removes the directory, otherwise only docker images and volumes are destroyed',
      option: '-r, --remove-dir',
    },
  ],
  handler(): CommandResult {
    const [project]: string[] = args.length > 0 ? args : ['default'];

    printMessage(`Destroying project ${project}`);

    const envDir = `${rcFile.rcRoot}/projects/${project}`;

    if (!pathExists(envDir)) {
      return { code: ExitCode.Error, fail: `The project ${project} doesn't exist` };
    }

    const runCmd = runCommand(`docker-compose -f docker/docker-compose.yml down --rmi all`, envDir);

    if (runCmd.code !== 0) {
      return { cmd: runCmd, code: runCmd.code, fail: `Error destroying ${project}` };
    }

    if (opts['r'] || opts['remove-dir']) {
      printMessage(`Removing folder ${envDir}`);
      const removeFolder = shell.rm('-rf', `${envDir}`);
      if (removeFolder.code !== 0) {
        return { cmd: removeFolder, code: removeFolder.code, fail: `Error deleting ${project}` };
      }
      printMessage(`Folder ${envDir} removed`);
    }

    return { code: ExitCode.Success, success: `Successfully destroyed ${project}` };
  },
});
