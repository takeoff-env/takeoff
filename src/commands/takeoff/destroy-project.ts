import { TakeoffResult, TakeoffCommand } from 'commands';
import { ExitCode, TaskRunnerOptions } from 'task';
import { TakeoffHelpers } from 'helpers';

export class Command implements TakeoffCommand {
  args = '<name>';
  command = 'destroy';
  description =
    'Destroys the docker containers for a project. Can also optionally remove the folder, this operation cannot be reversed.';
  group = 'takeoff';
  options = [
    {
      description: 'Also removes the directory, otherwise only docker images and volumes are destroyed',
      option: '-r, --remove-dir',
    },
  ];

  async handler({
    shell,
    getProjectDetails,
    args,
    opts,
    rcFile,
    pathExists,
    printMessage,
    execCommand,
    workingDir,
    silent,
  }: TakeoffHelpers): Promise<TakeoffResult> {
    const { project, projectDir } = getProjectDetails(args, workingDir, rcFile);

    if (!pathExists(projectDir)) {
      return { code: ExitCode.Error, fail: `The project ${project} doesn't exist` };
    }

    printMessage(`Destroying project ${project}`);

    const cmdOptions: TaskRunnerOptions = {
      cwd: projectDir,
      fail: `Error destroying ${project}.`,
      silent,
      success: `Successfully destroyed ${project}`,
      task: {
        script: `docker-compose -f docker/docker-compose.yml down --rmi all`,
      },
    };

    const result = await execCommand(cmdOptions);

    if (result.code !== 0) {
      return result;
    }

    if (opts['r'] || opts['remove-dir']) {
      printMessage(`Removing folder ${projectDir}`);
      const removeFolder = shell.rm('-rf', `${projectDir}`);
      if (removeFolder.code !== 0) {
        printMessage(
          `Docker images have been destroyed but unable to remove folder ${projectDir}`,
          removeFolder.stderr,
          {
            headerColour: 'red',
            textColour: 'red',
          },
        );
      } else {
        printMessage(`Folder ${projectDir} removed`);
      }
    }

    return result;
  }
}
