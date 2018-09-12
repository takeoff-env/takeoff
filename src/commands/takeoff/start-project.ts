import { TakeoffCommand } from 'commands';
import { TakeoffCmdParameters, TakeoffRcFile } from 'takeoff';

/**
 * Command for starting a project
 */

export = ({
  shell,
  args,
  opts,
  exitWithMessage,
  printMessage,
  rcFile,
}: TakeoffCmdParameters): TakeoffCommand => ({
  args: '<name> [service]',
  command: 'start',
  description:
    'Starts the named project. Optionally a docker app name can be passed to only start individual services.',
  group: 'takeoff',
  handler(): void {
    const [project, app]: string[] = args.length > 0 ? args : ['default'];

    printMessage(`Starting project ${project}`);

    const projectDir = `${rcFile.rcRoot}/projects/${project}`;

    if (!shell.test('-e', projectDir)) {
      return exitWithMessage(`The project ${project} doesn't exist`, 1);
    }

    let cmd = `docker-compose -f ${projectDir}/docker/docker-compose.yml up`;
    if (app) {
      cmd = `${cmd} -d ${app}`;
    }

    const runCmd = shell.exec(cmd, { slient: opts.v ? false : true });

    if (runCmd.code !== 0) {
      return exitWithMessage(`Cannot start ${project}` + app ? `:${app}` : '', 1, runCmd.stdout);
    }

    return exitWithMessage(`Started ${project}` + app ? `:${app}` : '', 0);
  },
});
