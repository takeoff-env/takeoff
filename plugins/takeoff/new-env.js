const { DEFAULT_BLUEPRINT_NAME } = require('../../bin/constants');

/**
 * Creates a new development environment from a blueprint
 * @module takeoff
 * @param {object} takeoff The object containing the command, arguments, working directory and dependency injected helpers
 * @param {string} takeoff.command The command being run
 * @param {string} takeoff.workingDir The working directory of where the command is run
 * @param {object} takeoff.args The arguments object passed from the command line
 * @param {object} takeoff.shell The ShellJS instance for doing shell-based commands
 * @param {object} takeoff.h The Helper object
 */
const handler = async ({ command, shell, args, opts, workingDir, h }) => {
  let [folderName, blueprintName] = args;

  if (!folderName) {
    shell.echo('You must pass a folder name');
    return shell.exit(1);
  }

  blueprintName = blueprintName || DEFAULT_BLUEPRINT_NAME;

  let cachedBlueprint = shell.test('-d', `${workingDir}/blueprints/${blueprintName}`);

  let blueprint =
    opts['b'] ||
    opts['blueprint-url'] ||
    (cachedBlueprint
      ? `${workingDir}/blueprints/${blueprintName}`
      : `https://github.com/takeoff-env/takeoff-blueprint-${blueprintName}.git`);
  let environment = folderName || 'default';

  shell.mkdir('-p', `${workingDir}/envs/${environment}`);
  const doClone = shell.exec(
    `git clone ${blueprint} ${workingDir}/envs/${environment} --depth 1 && rm -rf ${workingDir}/envs/${environment}/.git`,
  );
  if (doClone.code !== 0) {
    shell.echo(`Error cloning ${blueprint}`, doClone.stdout);
    shell.exit(1);
  }

  try {
    shell.echo(`[Takeoff]: Running Takeoff Config`);
    const envFile = require(`${workingDir}/envs/${environment}/takeoff.config.js`);
    const runEnv = await envFile({ command, shell, args, opts, workingDir, h });
    if (runEnv) {
      return shell.exit(0);
    }
  } catch (e) {
    shell.echo(e.message);
    return shell.exit(1);
  }
};

module.exports = {
  command: 'new',
  description: 'Creates a new environment',
  options: [
    {
      option: '-b, --blueprintUrl',
      description: 'Pass a git repository as a url for a blueprint',
    },
  ],
  args: '<name> [blueprint-name]',
  group: 'takeoff',
  handler,
};
