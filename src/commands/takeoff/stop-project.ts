import { TakeoffResult, TakeoffCommand } from 'commands';
import { TakeoffHelpers } from 'takeoff';
import { ExitCode } from 'task';
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
  opts,
}: TakeoffHelpers): TakeoffCommand => ({
  args: '<name> [...services]',
  command: 'stop',
  description: 'Stops all services in a named project',
  group: 'takeoff',
  options: [
    {
      description: 'Set a shutdown timeout in seconds',
      option: '-t, --timeout',
    },
  ],
  handler(): TakeoffResult {
    const { project, projectDir, apps } = getProjectDetails(args, workingDir, rcFile);

    if (!pathExists(projectDir)) {
      return { code: ExitCode.Error, fail: `The project ${project} doesn't exist` };
    }

    printMessage(`Stopping project ${project}`);

    let cmd = `docker-compose -f docker/docker-compose.yml stop`;
    if (opts['t'] || opts['timeout']) {
      cmd = `${cmd} -t ${opts['t'] || opts['timeout']}`;
    }
    if (apps) {
      cmd = `${cmd} ${apps.join(' ')}`;
    }

    const runCmd = runCommand(cmd, projectDir);

    return {
      code: runCmd.code,
      extra: runCmd.code === 0 ? runCmd.stdout : runCmd.stderr,
      fail: `Unable to stop ${project}`,
      success: `Successfully stopped ${project}`,
    };
  },
});
