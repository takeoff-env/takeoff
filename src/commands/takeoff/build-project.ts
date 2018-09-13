import { CommandResult, TakeoffCommand } from 'commands';
import { TakeoffCmdParameters } from 'takeoff';

/**
 * Builds an project based on a docker-compose file
 */

export = ({ args, opts, rcFile, pathExists, printMessage, runCommand }: TakeoffCmdParameters): TakeoffCommand => ({
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
    const [project] = args.length > 0 ? args : ['default'];

    printMessage(`Building project ${project}`);

    const projectDir = `${rcFile.rcRoot}/projects/${project}`;

    if (!pathExists(projectDir)) {
      return { code: 1, fail: `The project ${project} doesn't exist` };
    }

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
