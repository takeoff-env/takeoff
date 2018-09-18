import { TakeoffResult, TakeoffCommand } from 'commands';
import { TakeoffHelpers } from 'takeoff';
import { ExitCode } from 'task';

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
}: TakeoffHelpers): TakeoffCommand => ({
  args: '<name> [service]',
  command: 'pull',
  description: 'Pulls any pre-build images within a project (such a database images).',
  group: 'takeoff',
  handler(): TakeoffResult {
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
      code: runCmd.code,
      extra: runCmd.code === 0 ? runCmd.stdout : runCmd.stderr,
      fail: `Unable to pull ${project}`,
      success: `Pulled pre-built images for ${project} ${(apps && apps.join(' ')) || ''}`,
    };
  },
});
