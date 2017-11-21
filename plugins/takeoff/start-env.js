/**
 * Starts a named environment
 * @module takeoff
 * @param {object} takeoff The object containing the command, arguments, working directory and dependency injected helpers
 * @param {string} takeoff.command The command being run
 * @param {string} takeoff.workingDir The working directory of where the command is run
 * @param {object} takeoff.args The arguments object passed from the command line
 * @param {object} takeoff.shell The ShellJS instance for doing shell-based commands
 * @param {object} takeoff.h The Helper object
 */
const handler = async ({ command, shell, args, workingDir }) => {
  let [environment, app] = args.length > 0 ? args : ['default'];
  const envDir = `${workingDir}/envs/${environment}`;

  let cmd = `docker-compose -f ${envDir}/docker/docker-compose.yml up`;
  if (app) {
    cmd = `${cmd} -d ${app}`;
  }

  let runCmd = shell.exec(cmd);

  if (runCmd.code !== 0) {
    shell.echo('Error starting environments');
    shell.exit(1);
  }
  shell.echo(`Successfully started ${environment}`);
  shell.exit(0);
};

module.exports = {
  command: 'start',
  description: 'Starts an environment',
  options: [],
  args: '<name> [app]',
  group: 'takeoff',
  handler,
};
