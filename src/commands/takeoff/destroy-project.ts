import { CommandResult, TakeoffCommand } from 'commands';
import { TakeoffCmdParameters } from 'takeoff';
import { ExitCode } from 'task';

import { sep } from 'path';

/**
 * Destroys an project in a non-reversable way
 */
export = ({
  shell,
  getProjectDetails,
  args,
  opts,
  rcFile,
  pathExists,
  printMessage,
  runCommand,
  workingDir,
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
    const { project, projectDir } = getProjectDetails(args, workingDir, rcFile);

    if (!pathExists(projectDir)) {
      return { code: ExitCode.Error, fail: `The project ${project} doesn't exist` };
    }

    printMessage(`Destroying project ${project}`);

    const runCmd = runCommand(`docker-compose -f docker/docker-compose.yml down --rmi all`, projectDir);

    if (runCmd.code !== 0) {
      return { cmd: runCmd, code: runCmd.code, fail: `Error destroying ${project}` };
    }

    if (opts['r'] || opts['remove-dir']) {
      printMessage(`Removing folder ${projectDir}`);
      const removeFolder = shell.rm('-rf', `${projectDir}`);
      if (removeFolder.code !== 0) {
        return { cmd: removeFolder, code: removeFolder.code, fail: `Error deleting ${project}` };
      }
      printMessage(`Folder ${projectDir} removed`);
    }

    return { code: ExitCode.Success, success: `Successfully destroyed ${project}` };
  },
});
