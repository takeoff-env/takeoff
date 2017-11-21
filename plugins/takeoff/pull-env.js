/**
 * Does a docker-compose pull within an environment
 * @module takeoff
 * @param {object} takeoff The object containing the command, arguments, working directory and dependency injected helpers
 * @param {string} takeoff.command The command being run
 * @param {string} takeoff.workingDir The working directory of where the command is run
 * @param {object} takeoff.args The arguments object passed from the command line
 * @param {object} takeoff.shell The ShellJS instance for doing shell-based commands
 * @param {object} takeoff.h The Helper object
 */
const handler = async ({ shell, args, workingDir }) => {
  let [environment, service] = args.length > 0 ? args : ['default'];
  const envDir = `${workingDir}/envs/${environment}`;

  if (!shell.test('-e', envDir)) {
    shell.echo(`The environment ${environment} doesn't exist`);
    shell.exit(0); // Don't exit 1 as this might break CI workflows
  }

  let cmd = `docker-compose -f ${envDir}/docker/docker-compose.yml pull`;
  if (service) {
    cmd = cmd + ` ${service}`;
  }
  const runCmd = shell.exec(cmd);
  if (runCmd.code !== 0) {
    shell.echo(`Error pulling in ${environment}.  Use -v to see verbose logs`);
    shell.exit(1);
  }
  shell.echo(`Pulled pre-built images on ${environment}`);
  shell.exit(0);
};

module.exports = {
  command: 'pull',
  description: 'Pulls any pre-build images',
  options: [],
  args: '<name> [service]',
  group: 'takeoff',
  handler,
};
