import { CommandResult, TakeoffCommand } from 'commands';
import { TakeoffCmdParameters, TakeoffRcFile } from 'takeoff';
import { ExitCode } from 'task';

/**
 * Command that handles the stopping of a project
 */

export = ({ args, printMessage, pathExists, rcFile, runCommand }: TakeoffCmdParameters): TakeoffCommand => ({
  args: '<name>',
  command: 'stop',
  description: 'Stops all services in a named project',
  group: 'takeoff',
  handler(): CommandResult {
    const [project]: string[] = args.length > 0 ? args : ['default'];

    printMessage(`Stopping project ${project}`);

    const envDir = `${rcFile.rcRoot}/projects/${project}`;

    if (!pathExists(envDir)) {
      return { code: ExitCode.Error, fail: `The project ${project} doesn't exist` };
    }

    const runCmd = runCommand(`docker-compose -f docker/docker-compose.yml stop`, envDir);
    
    return {
      cmd: runCmd,
      code: runCmd.code,
      fail: `Unable to stop ${project}`,
      success: `Successfully stopped ${project}`,
    };
  },
});
