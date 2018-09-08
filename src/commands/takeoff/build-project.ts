import chalk from 'chalk';

/**
 * Builds an project based on a docker-compose file
 */

export = ({ shell, args, workingDir, opts }: TakeoffCmdParameters): TakeoffCommand => ({
  command: 'build',
  description: 'Builds an project',
  args: '<name>',
  group: 'takeoff',
  handler(): void {

    let [project] = args.length > 0 ? args : ['default'];
    const projectDir = `${workingDir}/projects/${project}`;

    if (!shell.test('-e', projectDir)) {
      shell.echo(`${chalk.red('[Takeoff]')}} The project ${project} doesn't exist`);
      shell.exit(1); // Don't exit 1 as this might break CI workflows
    }

    let runCmd = shell.exec(`docker-compose -f ${projectDir}/docker/docker-compose.yml build`, {
      slient: opts.v ? false : true
    });

    if (runCmd.code !== 0) {
      shell.echo(`${chalk.red('[Takeoff]')} Error starting project ${project}`);
      shell.exit(1);
    }
    shell.echo(`${chalk.magenta('[Takeoff]')}} Successfully started ${project}`);
    shell.exit(0);
  }
});
