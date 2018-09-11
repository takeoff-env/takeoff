import { TakeoffCmdParameters } from 'takeoff';
import { TakeoffCommand } from 'commands';

/**
 * Command for pulling an project
 */

export = ({ shell, args, workingDir, opts, exitWithMessage, printMessage }: TakeoffCmdParameters): TakeoffCommand => ({
  command: 'pull',
  description: 'Pulls any pre-build images',
  args: '<name> [service]',
  group: 'takeoff',
  handler(): void {
    let [project, service]: string[] = args.length > 0 ? args : ['default'];

    printMessage(`Pullng project ${project}`);

    const envDir = `${workingDir}/projects/${project}`;

    if (!shell.test('-e', envDir)) {
      return exitWithMessage(`The project ${project} doesn't exist`, 1);
    }

    let cmd = `docker-compose -f ${envDir}/docker/docker-compose.yml pull`;
    if (service) {
      cmd = cmd + ` ${service}`;
    }
    const runCmd = shell.exec(cmd, { slient: opts.v ? false : true });

    if (runCmd.code !== 0) {
      return exitWithMessage(`Unable to pull ${project}.  Use -v to see verbose logs`, 1, runCmd.stdout);
    }
    return exitWithMessage(`Pulled pre-built images for ${project}.  Use -v to see verbose logs`, 0);
  },
});
