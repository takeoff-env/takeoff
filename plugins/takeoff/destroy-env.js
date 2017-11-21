/**
 * Destroys an environment in a non-reversable way
 * @module takeoff
 * @param {object} takeoff The object containing the command, arguments, working directory and dependency injected helpers
 * @param {string} takeoff.command The command being run
 * @param {string} takeoff.workingDir The working directory of where the command is run
 * @param {object} takeoff.args The arguments object passed from the command line
 * @param {object} takeoff.shell The ShellJS instance for doing shell-based commands
 * @param {object} takeoff.h The Helper object
 */
const handler = async ({ shell, args, workingDir }) => {
  let [environment] = args.length > 0 ? args : ['default'];
  const envDir = `${workingDir}/envs/${environment}`;

  if (!shell.test('-e', envDir)) {
    shell.echo(`The environment ${environment} doesn't exist`);
    shell.exit(0); // Don't exit 1 as this might break CI workflows
  }

  const dockerDown = shell.exec(
    `docker-compose -f ${envDir}/docker/docker-compose.yml down --rmi all`,
  );
  if (dockerDown.code !== 0) {
    shell.echo('Error stopping environments');
    shell.exit(1);
  }

  const removeFolder = shell.rm('-rf', `${envDir}`);
  if (removeFolder.code !== 0) {
    shell.echo('Error deleting environments');
    shell.exit(1);
  }

  shell.echo(`Successfully destroyed ${environment}`);
  shell.exit(0);
};

module.exports = {
  command: 'destroy',
  description: 'Destroys an environment',
  options: [],
  args: '<name>',
  group: 'takeoff',
  handler,
};
