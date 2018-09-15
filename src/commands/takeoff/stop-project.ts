import { CommandResult, TakeoffCommand } from 'commands';
import { TakeoffCmdParameters } from 'takeoff';
import { ExitCode } from 'task';

import { sep } from 'path';

/**
 * Command that handles the stopping of a project
 */

export = ({
  args,
  printMessage,
  pathExists,
  rcFile,
  workingDir,
  runCommand,
  getProjectDetails,
}: TakeoffCmdParameters): TakeoffCommand => ({
  args: '<name>',
  command: 'stop',
  description: 'Stops all services in a named project',
  group: 'takeoff',
  handler(): CommandResult {
    const { project, projectDir } = getProjectDetails(args, workingDir, rcFile);
    if (!pathExists(projectDir)) {
      return { code: ExitCode.Error, fail: `The project ${project} doesn't exist` };
    }

    printMessage(`Stopping project ${project}`);

    const runCmd = runCommand(`docker-compose -f docker/docker-compose.yml stop`, projectDir);

    return {
      cmd: runCmd,
      code: runCmd.code,
      fail: `Unable to stop ${project}`,
      success: `Successfully stopped ${project}`,
    };
  },
});
