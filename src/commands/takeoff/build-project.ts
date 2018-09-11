import { TakeoffCmdParameters } from 'takeoff';
import { TakeoffCommand } from 'commands';

/**
 * Builds an project based on a docker-compose file
 */

export = ({ shell, args, workingDir, opts, printMessage, exitWithMessage }: TakeoffCmdParameters): TakeoffCommand => ({
  command: 'build',
  description: 'Builds containers based on a docker-compose file',
  args: '<name>',
  group: 'takeoff',
  handler(): void {
    let [project] = args.length > 0 ? args : ['default'];

    printMessage(`Building project ${project}`);

    const projectDir = `${workingDir}/projects/${project}`;

    if (!shell.test('-e', projectDir)) {
      return exitWithMessage(`The project ${project} doesn't exist`, 1);
    }

    let runCmd = shell.exec(`docker-compose -f ${projectDir}/docker/docker-compose.yml build`, {
      slient: opts.v ? false : true,
    });

    if (runCmd.code !== 0) {
      return exitWithMessage(`Error starting project ${project}`, 1, runCmd.stdout);
    }
    return exitWithMessage(`Successfully started ${project}`, 0);
  },
});
