import rcCheck from '../../lib/rc-check';

/**
 * Destroys an project in a non-reversable way
 */
export = ({ shell, args, workingDir, opts }: TakeoffCmdParameters): TakeoffCommand => ({
  command: 'destroy',
  description: 'Destroys an named project. This action cannot be reversed.',
  args: '<name>',
  group: 'takeoff',
  handler(): void {
    rcCheck(shell, workingDir);

    let [project]: string[] = args.length > 0 ? args : ['default'];
    const envDir = `${workingDir}/projects/${project}`;

    if (!shell.test('-e', envDir)) {
      shell.echo(`The project ${project} doesn't exist`);
      shell.exit(0); // Don't exit 1 as this might break CI workflows
    }

    const dockerDown = shell.exec(`docker-compose -f ${envDir}/docker/docker-compose.yml down --rmi all`, { slient: opts.v ? false: true });
    if (dockerDown.code !== 0) {
      shell.echo('Error stopping projects');
      shell.exit(1);
    }

    const removeFolder = shell.rm('-rf', `${envDir}`);
    if (removeFolder.code !== 0) {
      shell.echo('Error deleting projects');
      shell.exit(1);
    }

    shell.echo(`Successfully destroyed ${project}`);
    shell.exit(0);
  }
});
