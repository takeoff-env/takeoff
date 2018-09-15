import { CommandResult, TakeoffCommand } from 'commands';
import { TakeoffCmdParameters } from 'takeoff';
import { ExitCode } from 'task';

import { sep } from 'path';

/**
 * Command for pulling an project
 */

export = ({
  args,
  rcFile,
  pathExists,
  printMessage,
  workingDir,
  runCommand,
  getProjectDetails,
}: TakeoffCmdParameters): TakeoffCommand => ({
  args: '<name> [service]',
  command: 'pull',
  description: 'Pulls any pre-build images within a project (such a database images).',
  group: 'takeoff',
  handler(): CommandResult {
    const { project, projectDir, apps } = getProjectDetails(args, workingDir, rcFile);

    if (!pathExists(projectDir)) {
      return { code: ExitCode.Error, fail: `The project ${project} doesn't exist` };
    }

    printMessage(`Pulling ${project} ${(apps && apps.join(' ')) || ''}`);

    let cmd = `docker-compose -f docker/docker-compose.yml pull`;
    if (apps) {
      cmd = `${cmd} ${apps && apps.join(' ')}`;
    }

    const runCmd = runCommand(cmd, projectDir);

    return {
      cmd: runCmd,
      code: runCmd.code,
      fail: `Unable to pull ${project}`,
      success: `Pulled pre-built images for ${project} ${(apps && apps.join(' ')) || ''}`,
    };
  },
});
