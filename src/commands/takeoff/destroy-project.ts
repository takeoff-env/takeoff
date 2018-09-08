import chalk from 'chalk';

/**
 * Destroys an project in a non-reversable way
 */
export = ({ shell, args, workingDir, opts }: TakeoffCmdParameters): TakeoffCommand => ({
  command: 'destroy',
  description: 'Destroys an named project. This action cannot be reversed.',
  args: '<name>',
  options: [
    {
      option: '-r, --remove-dir',
      description: 'Also removes the directory, otherwise only docker images and volumes are destroyed'
    }
  ],
  group: 'takeoff',
  handler(): void {

    let [project]: string[] = args.length > 0 ? args : ['default'];
    const envDir = `${workingDir}/projects/${project}`;

    if (!shell.test('-e', envDir)) {
      shell.echo(`${chalk.red('[Takeoff]')} The project ${project} doesn't exist`);
      shell.exit(1);
    }

    const dockerDown = shell.exec(`docker-compose -f ${envDir}/docker/docker-compose.yml down --rmi all`, {
      slient: opts.v ? false : true
    });
    if (dockerDown.code !== 0) {
      shell.echo(`${chalk.red('[Takeoff]')} Error stopping projects`);
      shell.exit(1);
    }

    if (opts['r'] || opts['remove-dir']) {
      const removeFolder = shell.rm('-rf', `${envDir}`);
      if (removeFolder.code !== 0) {
        shell.echo(`${chalk.red('[Takeoff]')} Error deleting projects`);
        shell.exit(1);
      }
      shell.echo(`${chalk.magenta('[Takeoff]')} Folder ${envDir} removed`);
    }

    shell.echo(`${chalk.magenta('[Takeoff]')} Successfully destroyed ${project}`);
    shell.exit(0);
  }
});
