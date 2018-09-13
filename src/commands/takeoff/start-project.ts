import { CommandResult, TakeoffCommand } from 'commands';
import { TakeoffCmdParameters } from 'takeoff';
import { ExitCode } from 'task';

/**
 * Command for starting a project
 */

export = ({ args, pathExists, printMessage, rcFile, runCommand }: TakeoffCmdParameters): TakeoffCommand => ({
  args: '<name> [service]',
  command: 'start',
  description:
    'Starts the named project. Optionally a docker app name can be passed to only start individual services.',
  group: 'takeoff',
  handler(): CommandResult {
    const [project, app]: string[] = args.length > 0 ? args : ['default'];

    printMessage(`Starting project ${project}`);

    const envDir = `${rcFile.rcRoot}/projects/${project}`;

    if (!pathExists(envDir)) {
      return { code: ExitCode.Error, fail: `The project ${project} doesn't exist` };
    }

    let cmd = `docker-compose -f docker/docker-compose.yml up`;
    if (app) {
      cmd = `${cmd} -d ${app}`;
    }

    const runCmd = runCommand(cmd, envDir);

    return {
      cmd: runCmd,
      code: runCmd.code,
      fail: `Unable to start ${project} ${app || ''}`,
      success: `Successfully started ${project} ${app || ''}`,
    };
  },
});
