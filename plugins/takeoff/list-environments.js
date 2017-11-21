#!/usr/bin/env node

const glob = require('glob-promise');
const Path = require('path');

/**
 * Find all package.json within subdirectories of a folder
 * @param {string} baseDir 
 * @returns {Array<string>}
 */
const getEnvPackages = async baseDir => {
  // Do all the pre-plugin loading
  const basePath = `${Path.normalize(baseDir)}/envs`;
  let envs = [];
  try {
    envs = await glob('**/package.json', { cwd: basePath, ignore: ['**/node_modules/**'] });
  } catch (e) {
    throw e;
  }
  return envs.sort((a, b) => {
    if (a.length === b.length) {
      return 0;
    }
    return a.length > b.length ? -1 : 1;
  });
};

/**
 * Lists all environments
 * @module takeoff
 * @param {object} takeoff The object containing the command, arguments, working directory and dependency injected helpers
 * @param {string} takeoff.command The command being run
 * @param {string} takeoff.workingDir The working directory of where the command is run
 * @param {object} takeoff.args The arguments object passed from the command line
 * @param {object} takeoff.shell The ShellJS instance for doing shell-based commands
 * @param {object} takeoff.h The Helper object
 */
const handler = async ({ shell, workingDir, h }) => {
  const packagePaths = await getEnvPackages(workingDir);
  const tableValues = [];
  const environments = [];
  const apps = {};

  packagePaths.forEach(pkg => {
    let envName, app, a, b;
    let split;
    if (pkg.match('/env/')) {
      split = pkg.split('/');
      [envName, a, app, b] = split;
      apps[envName] = apps[envName] || [];
      apps[envName].push(app);
    } else {
      try {
        split = pkg.split('/');
        [envName] = split;
        const pkgJson = require(`${workingDir}/envs/${pkg}`);
        const { version } = pkgJson;
        environments.push({ envName, version });
        apps[envName] = apps[envName] || [];
      } catch (e) {}
    }
  });

  environments.forEach(env => {
    tableValues.push([env.envName, env.version, (apps[env.envName] || []).join(', ')]);
  });

  var commandsTable = h.table(
    [
      { value: 'Environment', align: 'left' },
      { value: 'Version', align: 'left' },
      { value: 'Apps', align: 'left' },
    ],
    tableValues,
    { borderStyle: 0, compact: true, align: 'left', headerAlign: 'left' },
  );
  shell.echo(commandsTable.render());
  shell.exit(0);
};

module.exports = {
  command: 'list',
  description: 'List all the available environments',
  args: '',
  options: [],
  group: 'takeoff',
  handler,
};
