/**
 * Check to see if there is a .takeoffrc file in the environment folder, if not then we exit
 */
export = (shell: any, workingDir: string) => {
  if (!shell.test('-f', `${workingDir}/.takeoffrc`)) {
    shell.echo(`No .takeoffrc file found, are you runnng this within a Takeoff environment?`);
    return shell.exit(1);
  }
}
