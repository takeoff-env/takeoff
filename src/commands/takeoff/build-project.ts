import { CommandResult, TakeoffCommand } from 'commands';
import { TakeoffCmdParameters } from 'takeoff';

/**
 * Builds an project based on a docker-compose file
 */

export = ({
  args,
  getProjectDetails,
  opts,
  rcFile,
  pathExists,
  printMessage,
  workingDir,
  runCommand,
}: TakeoffCmdParameters): TakeoffCommand => ({
  args: '<name>',
  command: 'build',
  description: 'Builds containers based on a docker-compose file',
  group: 'takeoff',
  options: [
    {
      description: `Build fresh and don't use the cache`,
      option: '-n, --no-cache',
    },
  ],
  handler(): CommandResult {

    const {project, projectDir} = getProjectDetails(args, workingDir, rcFile);

    if (!pathExists(projectDir)) {
      return { code: 1, fail: `The project ${project} doesn't exist` };
    }

    printMessage(`Building project ${project}`);

    let cmd = `docker-compose -f docker/docker-compose.yml build`;
    if (opts['n'] || opts['no-cache']) {
      cmd = `${cmd} --no-cache`;
    }

    const runCmd = runCommand(cmd, projectDir);

    return {
      cmd: runCmd,
      code: runCmd.code,
      fail: `Error building ${project}.`,
      success: `Successfully built ${project}`,
    };
  },
});
