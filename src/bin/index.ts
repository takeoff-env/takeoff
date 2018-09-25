#!/usr/bin/env node

import '../lib/bin/bootstrap';

import minimist from 'minimist';
import pjson from 'pjson';
import shell from 'shelljs';

import { TakeoffResult } from 'commands';
import { TakeoffCommandRequest } from 'takeoff';
import { ExitCode } from 'task';

// Dependencies for CLI
import checkDependencies from '../lib/bin/check-dependencies';
import extractArguments from '../lib/bin/extract-arguments';
import loadCommands from '../lib/bin/load-commands';
import renderHelp from '../lib/help/render-help';
import getCommandFromString from '../lib/helpers/get-command-from-string';
import exitWithMessage from '../lib/helpers/exit-with-message';
import createHelpers from '../lib/bin/create-helpers';
import loadRcFile from '../lib/bin/load-rc-file';
import { TakeoffHelpers } from 'helpers';

/**
 * Main function executed when the Takeoff commannd line is run
 */
async function run(workingDir: string, cliArgs: string[]): Promise<void> {
  const rcFile = loadRcFile(workingDir);
  let customDependencies = [];
  if (rcFile.exists && rcFile.properties.has('dependencies')) {
    customDependencies = rcFile.properties.get('dependencies');
  }

  const { code, fail } = checkDependencies(customDependencies);

  if (code !== 0) {
    return exitWithMessage({ code, fail });
  }

  const { command, args, opts } = extractArguments(minimist(cliArgs));

  const silent = opts['v'] || opts['--verbose'] ? false : true;

  const takeoff: TakeoffHelpers = createHelpers({
    args,
    command,
    opts,
    silent,
    workingDir,
  });

  let takeoffCommands;
  try {
    takeoffCommands = await loadCommands([`${__dirname}/../commands`, `${workingDir}/commands`]);
  } catch (e) {
    throw exitWithMessage({ code: ExitCode.Error, fail: 'Unable to load commands', extra: e });
  }

  // Parse the request
  const request: TakeoffCommandRequest = getCommandFromString(command);
  if ((request.cmd === 'takeoff' && request.app === 'takeoff') || request.app === 'help') {
    return renderHelp(takeoffCommands, shell, args, pjson.version);
  }

  // Check if the command exists in the plugins
  const plugin = takeoffCommands.get(`${request.cmd}:${request.app}`);
  if (!plugin) {
    return exitWithMessage({ code: ExitCode.Error, fail: `${request.cmd}:${request.app} not found` });
  }

  if (!plugin.global && !rcFile.exists) {
    return exitWithMessage({
      code: ExitCode.Error,
      fail: `.takeoffrc file not found, cannot run ${request.cmd}:${request.app}`,
    });
  }

  // Set a default exit, and run the plugin to get the correct result
  let result: TakeoffResult = {
    code: 0,
    success: `${plugin.group}:${plugin.command} done`,
  };
  try {
    result = await plugin.handler(takeoff);
  } catch (e) {
    result = {
      code: ExitCode.Error,
      extra: e,
      fail: `Unable to run handler for plugin ${plugin.group}:${plugin.command}`,
    };
  }

  return exitWithMessage(result);
}

// Run the CLI tool
run(process.cwd(), process.argv.slice(2));
