/**
 * Command that handles the stopping of a project
 */

export = ({ shell, args, workingDir, opts }: TakeoffCmdParameters): TakeoffCommand => ({
  command: 'stop',
  description: 'Stops all services in a named project',
  args: '<name>',
  group: 'takeoff',
  handler(): void {
    let [project]: string[] = args.length > 0 ? args : ['default'];

    const projectDir = `${workingDir}/projects/${project}`;

    if (!shell.test('-e', projectDir)) {
      shell.echo(`The project ${project} doesn't exist`);
      shell.exit(0); // Don't exit 1 as this might break CI workflows
    }

    let cmd = `docker-compose -f ${projectDir}/docker/docker-compose.yml stop`;

    let runCmd = shell.exec(cmd, { slient: opts.v ? false : true });

    if (runCmd.code !== 0) {
      shell.echo(`Error stopping ${project}`);
      shell.exit(1);
    }
    shell.echo(`Successfully stopped ${project}`);
    shell.exit(0);
  }
});
