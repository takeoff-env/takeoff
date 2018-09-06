import chalk from 'chalk';
/**
 * Check to see if there is a .takeoffrc file in the environment folder, if not then we exit
 */
export = (shell: any, workingDir: string) => {
  //`Finished '${chalk.cyan(task.name)}' ${chalk.magenta(
  if (!shell.test('-f', `${workingDir}/.takeoffrc`)) {
    shell.echo(
      `${chalk.red(
        'No .takeoffrc file found, are you runnng this within a Takeoff environment?',
      )}`,
    );
    return shell.exit(1);
  }
};
