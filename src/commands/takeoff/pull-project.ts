import rcCheck from '../../lib/rc-check';

/**
 * Command for pulling an environment
 */

export = ({ shell, args, workingDir, opts }: TakeoffCmdParameters): TakeoffCommand => ({
  command: 'pull',
  description: 'Pulls any pre-build images',
  args: '<name> [service]',
  group: 'takeoff',
  handler(): void {
    rcCheck(shell, workingDir);

    let [environment, service]: string[] = args.length > 0 ? args : ['default'];

    const envDir = `${workingDir}/projects/${environment}`;

    if (!shell.test('-e', envDir)) {
      shell.echo(`The environment ${environment} doesn't exist`);
      shell.exit(0); // Don't exit 1 as this might break CI workflows
    }

    let cmd = `docker-compose -f ${envDir}/docker/docker-compose.yml pull`;
    if (service) {
      cmd = cmd + ` ${service}`;
    }
    const runCmd = shell.exec(cmd, { slient: opts.v ? false: true });
    if (runCmd.code !== 0) {
      shell.echo(`Error pulling in ${environment}.  Use -v to see verbose logs`);
      shell.exit(1);
    }
    shell.echo(`Pulled pre-built images on ${environment}`);
    shell.exit(0);
  }
});
