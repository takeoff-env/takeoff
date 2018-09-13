import { TakeoffCommand } from 'commands';
import { TakeoffCmdParameters, TakeoffRcFile } from 'takeoff';

/**
 * Builds an project based on a docker-compose file
 */

export = ({
  shell,
  args,
  opts,
  rcFile,
  silent,
  pathExists,
  printMessage,
  exitWithMessage,
}: TakeoffCmdParameters): TakeoffCommand => ({
  args: '<name>',
  command: 'build',
  description: 'Builds containers based on a docker-compose file',
  group: 'takeoff',
  handler(): void {
    const [project] = args.length > 0 ? args : ['default'];

    printMessage(`Building project ${project}`);

    const projectDir = `${rcFile.rcRoot}/projects/${project}`;

    if (!pathExists(projectDir)) {
      return exitWithMessage(`The project ${project} doesn't exist`, 1);
    }

    const runCmd = shell.exec(`docker-compose -f ${projectDir}/docker/docker-compose.yml build`, {
      silent,
    });

    return exitWithMessage(
      runCmd.code !== 0
        ? `Error starting project ${project}.  Use -v to see verbose logs`
        : `Successfully started ${project}`,
      runCmd.code,
      silent ? undefined : runCmd.code ? runCmd.stderr : runCmd.stdout,
    );
  },
});
