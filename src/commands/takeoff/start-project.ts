import { CommandResult, TakeoffCommand } from 'commands';
import { TakeoffCmdParameters } from 'takeoff';
import { ExitCode } from 'task';

/**
 * Command for starting a project
 */

export = ({
  opts,
  args,
  pathExists,
  printMessage,
  rcFile,
  workingDir,
  runCommand,
  getProjectDetails,
}: TakeoffCmdParameters): TakeoffCommand => ({
  args: '<name> [service]',
  command: 'start',
  description:
    'Starts the named project. Optionally a docker app name can be passed to only start individual services.',
  group: 'takeoff',
  options: [
    {
      description: 'Detach the docker containers',
      option: '-d, --detach',
    },
  ],
  handler(): CommandResult {
    const { project, projectDir, apps } = getProjectDetails(args, workingDir, rcFile);

    if (!pathExists(projectDir)) {
      return { code: ExitCode.Error, fail: `The project ${project} doesn't exist` };
    }

    printMessage(`Starting project ${project} ${(apps && apps.join(' ')) || ''}`);

    let cmd = `docker-compose -f docker/docker-compose.yml up`;
    if (opts['d'] || opts['deatch']) {
      cmd = `${cmd} -d`;
    }
    if (apps) {
      cmd = `${cmd} ${apps.join(' ')}`;
    }

    // We want to see the docker output in this command
    const runCmd = runCommand(cmd, projectDir, true);

    return {
      cmd: runCmd,
      code: runCmd.code,
      fail: `Unable to start ${project} ${(apps && apps.join(' ')) || ''}`,
      success: `Successfully started ${project} ${apps.join(' ') || ''}`,
    };
  },
});
