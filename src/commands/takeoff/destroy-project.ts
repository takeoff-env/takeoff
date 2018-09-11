import { TakeoffCommand } from 'commands';
import { TakeoffCmdParameters } from 'takeoff';

/**
 * Destroys an project in a non-reversable way
 */
export = ({ shell, args, workingDir, opts, printMessage, exitWithMessage }: TakeoffCmdParameters): TakeoffCommand => ({
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
  handler(): void {
    const [project]: string[] = args.length > 0 ? args : ['default'];

    printMessage(`Destroying project ${project}`);

    const envDir = `${workingDir}/projects/${project}`;

    if (!shell.test('-e', envDir)) {
      return exitWithMessage(`The project ${project} doesn't exist`, 1);
    }

    const dockerDown = shell.exec(`docker-compose -f ${envDir}/docker/docker-compose.yml down --rmi all`, {
      slient: opts.v ? false : true,
    });

    if (dockerDown.code !== 0) {
      return exitWithMessage(`Error stopping ${project}`, 1);
    }

    if (opts['r'] || opts['remove-dir']) {
      printMessage(`Removing folder ${envDir}`);

      const removeFolder = shell.rm('-rf', `${envDir}`);
      if (removeFolder.code !== 0) {
        return exitWithMessage(`Error deleting ${project}`, 1, removeFolder.stdout);
      }

      printMessage(`Folder ${envDir} removed`);
    }

    return exitWithMessage(`Successfully destroyed ${project}`, 0);
  },
});
