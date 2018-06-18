const {
  DEFAULT_BLUEPRINT_NAME
} = require('../../bin/constants');

/**
 * Initialises a Takeoff environment
 * @module takeoff
 * @param {object} takeoff The object containing the command, arguments, working directory and dependency injected helpers
 * @param {string} takeoff.command The command being run
 * @param {string} takeoff.workingDir The working directory of where the command is run
 * @param {object} takeoff.args The arguments object passed from the command line
 * @param {object} takeoff.shell The ShellJS instance for doing shell-based commands
 * @param {object} takeoff.h The Helper object
 */
const handler = async ({
  command,
  shell,
  args,
  opts,
  workingDir,
  h
}) => {
  let [folderName, blueprintName] = args;

  if (!folderName) {
    shell.echo('You must pass a folder name');
    return shell.exit(1);
  }

  if (shell.test('-e', folderName)) {
    shell.echo(`Environment ${folderName} already exists`);
    return shell.exit(1);
  }

  blueprintName = blueprintName || DEFAULT_BLUEPRINT_NAME;

  shell.echo(`Creating folder ${folderName}`);
  shell.mkdir('-p', [
    `${workingDir}/${folderName}`,
    `${workingDir}/${folderName}/blueprints`,
    `${workingDir}/${folderName}/envs`,
  ]);

  if (opts['n'] || opts['no-default']) {
    shell.echo('Skipping creating default environment');
    return shell.exit(0);
  }

  let blueprint =
    opts['b'] ||
    opts['blueprint-url'] ||
    `https://github.com/takeoff-env/takeoff-blueprint-${blueprintName}.git`;
  let environment = 'default';

  if (!shell.test('-d', `${workingDir}/${folderName}/blueprints/${blueprintName}`)) {
    shell.mkdir('-p', `${workingDir}/${folderName}/blueprints/${blueprintName}`);
    const doClone = shell.exec(
      `git clone ${blueprint} ${workingDir}/${folderName}/blueprints/${blueprintName} --depth 1`,
    );
    if (doClone.code !== 0) {
      shell.echo(`Error cloning ${blueprint}`, doClone.stdout);
      shell.exit(1);
    }
    shell.echo(`Cloned ${blueprint} to cache`);
  }

  shell.mkdir('-p', `${workingDir}/${folderName}/envs/${environment}`);
  const doClone = shell.exec(
    `git clone ${workingDir}/${folderName}/blueprints/${blueprintName} ${workingDir}/${folderName}/envs/${environment} --depth 1`,
  );
  if (doClone.code !== 0) {
    shell.echo(`Error cloning ${blueprint}`, doClone.stdout);
    shell.exit(1);
  }


  shell.echo(`[Takeoff]: Running Takeoff Config`);
  const doMaid = shell.exec(
    `cd ${workingDir}/${folderName}/envs/${environment} && npx maid takeoff`
  )
  if (doMaid.code === 0) {
    shell.echo(`cd ${workingDir}/${folderName}/envs/${environment} && npx maid takeoff`, doClone.stdout);
    shell.exit(1);
  }
  shell.echo(`Ran Config`);
};

module.exports = {
  command: 'init',
  description: 'Creates a new environment container',
  options: [{
      option: '-b, --blueprint-url',
      description: 'Pass a git repository as a url for a blueprint to begin the default with',
    },
    {
      option: '-n, --no-default',
      description: 'Pass a git repository as a url for a blueprint to begin the default with',
    },
  ],
  args: '<name> [blueprint-name]',
  group: 'takeoff',
  handler,
};
