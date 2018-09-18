import { TakeoffResult, TakeoffCommand } from 'commands';
import { ExitCode } from 'task';
import { TakeoffHelpers } from 'helpers';

/**
 * Handler for destroying project
 */
function handler({
  shell,
  getProjectDetails,
  args,
  opts,
  rcFile,
  pathExists,
  printMessage,
  runCommand,
  workingDir,
}: TakeoffHelpers): TakeoffResult {
  const { project, projectDir } = getProjectDetails(args, workingDir, rcFile);

  if (!pathExists(projectDir)) {
    return { code: ExitCode.Error, fail: `The project ${project} doesn't exist` };
  }

  printMessage(`Destroying project ${project}`);

  const runCmd = runCommand(`docker-compose -f docker/docker-compose.yml down --rmi all`, projectDir);

  if (runCmd.code !== 0) {
    return { extra: runCmd.stderr, code: runCmd.code, fail: `Error destroying ${project}` };
  }

  if (opts['r'] || opts['remove-dir']) {
    printMessage(`Removing folder ${projectDir}`);
    const removeFolder = shell.rm('-rf', `${projectDir}`);
    if (removeFolder.code !== 0) {
      return { extra: removeFolder.stderr, code: removeFolder.code, fail: `Error deleting ${project}` };
    }
    printMessage(`Folder ${projectDir} removed`);
  }

  return { code: ExitCode.Success, success: `Successfully destroyed ${project}` };
}

/**
 * Command that destroys an project in a non-reversable way
 */
const command: TakeoffCommand = {
  args: '<name>',
  command: 'destroy',
  description:
    'Destroys the docker containers for a project. Can also optionally remove the folder, this operation cannot be reversed.',
  group: 'takeoff',
  handler,
  options: [
    {
      description: 'Also removes the directory, otherwise only docker images and volumes are destroyed',
      option: '-r, --remove-dir',
    },
  ],
};

export = command;
