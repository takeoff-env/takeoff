import rcCheck from '../../lib/rc-check';

/**
 * Builds an project based on a docker-compose file
 */

export = ({ shell, args, workingDir, opts }: TakeoffCmdParameters): TakeoffCommand => ({
  command: 'build',
  description: 'Builds an project',
  args: '<name>',
  group: 'takeoff',
  handler(): void {
    rcCheck(shell, workingDir);

    let [project] = args.length > 0 ? args : ['default'];
    const projectDir = `${workingDir}/projects/${project}`;

    if (!shell.test('-e', projectDir)) {
      shell.echo(`The project ${project} doesn't exist`);
      shell.exit(0); // Don't exit 1 as this might break CI workflows
    }

    let runCmd = shell.exec(`docker-compose -f ${projectDir}/docker/docker-compose.yml build`, { slient: opts.v ? false: true });

    if (runCmd.code !== 0) {
      shell.echo('Error starting projects');
      shell.exit(1);
    }
    shell.echo(`Successfully started ${project}`);
    shell.exit(0);
  }
});
