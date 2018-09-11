import { TakeoffCommand } from 'commands';
import { TakeoffCmdParameters } from 'takeoff';

/**
 * Builds an project based on a docker-compose file
 */

export = ({ shell, args, workingDir, opts, printMessage, exitWithMessage }: TakeoffCmdParameters): TakeoffCommand => ({
  args: '<name>',
  command: 'build',
  description: 'Builds containers based on a docker-compose file',
  group: 'takeoff',
  handler(): void {
    const [project] = args.length > 0 ? args : ['default'];

    printMessage(`Building project ${project}`);

    const projectDir = `${workingDir}/projects/${project}`;

    if (!shell.test('-e', projectDir)) {
      return exitWithMessage(`The project ${project} doesn't exist`, 1);
    }

    const runCmd = shell.exec(`docker-compose -f ${projectDir}/docker/docker-compose.yml build`, {
      slient: opts.v ? false : true,
    });

    if (runCmd.code !== 0) {
      return exitWithMessage(`Error starting project ${project}`, 1, runCmd.stdout);
    }

    return exitWithMessage(`Successfully started ${project}`, 0);
  },
});
