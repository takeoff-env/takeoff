import rcCheck from '../../lib/rc-check';

/**
 * Command for starting a project
 */

export = ({ shell, args, workingDir, opts }: TakeoffCmdParameters): TakeoffCommand => ({
  command: 'start',
  description:
    'Starts the named project. Optionally a docker app name can be passed to only start individual services.',
  args: '<name> [service]',
  group: 'takeoff',
  handler(): void {
    rcCheck(shell, workingDir);

    let [project, app]: string[] = args.length > 0 ? args : ['default'];

    const projectDir = `${workingDir}/projects/${project}`;

    let cmd = `docker-compose -f ${projectDir}/docker/docker-compose.yml up`;
    if (app) {
      cmd = `${cmd} -d ${app}`;
    }

    let runCmd = shell.exec(cmd, { slient: opts.v ? false: true });

    if (runCmd.code !== 0) {
      shell.echo(`Error starting project ${project}` + app ? `:${app}` : '');
      shell.exit(1);
    }
    shell.echo(`Successfully started ${project}` + app ? `:${app}` : '');
    shell.exit(0);
  }
});
