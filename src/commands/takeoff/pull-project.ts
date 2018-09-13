import { CommandResult, TakeoffCommand } from 'commands';
import { TakeoffCmdParameters } from 'takeoff';
import { ExitCode } from 'task';

/**
 * Command for pulling an project
 */

export = ({ args, rcFile, pathExists, printMessage, runCommand }: TakeoffCmdParameters): TakeoffCommand => ({
  args: '<name> [service]',
  command: 'pull',
  description: 'Pulls any pre-build images within a project (such a database images).',
  group: 'takeoff',
  handler(): CommandResult {
    const [project, service]: string[] = args.length > 0 ? args : ['default'];

    printMessage(`Pulling ${project} ${service || ''}`);

    const envDir = `${rcFile.rcRoot}/projects/${project}`;

    if (!pathExists(envDir)) {
      return { code: ExitCode.Error, fail: `The project ${project} doesn't exist` };
    }

    let cmd = `docker-compose -f docker/docker-compose.yml pull`;
    if (service) {
      cmd = `${cmd} ${service}`;
    }

    const runCmd = runCommand(cmd, envDir);

    return {
      cmd: runCmd,
      code: runCmd.code,
      fail: `Unable to pull ${project}`,
      success: `Pulled pre-built images for ${project}`,
    };
  },
});
