#!/usr/bin/env node

import '../lib/bootstrap';

import minimist from 'minimist';
import pjson from 'pjson';
import shell from 'shelljs';

import { CommandResult } from 'commands';
import { TakeoffCmdParameters, TakeoffCommandRequest } from 'takeoff';
import { ExitCode } from 'task';

import checkDependencies from '../lib/check-dependencies';
import exitWithMessage from '../lib/commands/exit-with-message';
import fileExists from '../lib/commands/file-exists';
import getCommandFromString from '../lib/commands/get-command-from-string';
import getProjectDetails from '../lib/commands/get-project-details';
import pathExists from '../lib/commands/path-exists';
import printMessage from '../lib/commands/print-message';
import createRunCommand from '../lib/commands/run-command';
import extractArguments from '../lib/extract-arguments';
import renderHelp from '../lib/help/render-help';
import loadCommands from '../lib/load-commands';
import loadRcFile from '../lib/load-rc-file';

/**
 * Main function executed when the Takeoff commannd line is run
 */
const run = async (workingDir: string, cliArgs: string[]) => {

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

  const takeoff: TakeoffCmdParameters = {
    args,
    command,
    exitWithMessage,
    fileExists,
    getProjectDetails,
    opts,
    pathExists,
    printMessage,
    rcFile: loadRcFile(workingDir),
    runCommand: createRunCommand(silent, workingDir),
    shell,
    silent,
    workingDir,
  };

  let takeoffCommands;
  try {
    takeoffCommands = await loadCommands([`${__dirname}/../commands`, `${workingDir}/commands`], takeoff);
  } catch (e) {
    throw exitWithMessage({code: ExitCode.Error, fail: 'Unable to load commands', extra: e});
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

  if (!plugin.skipRcCheck && !rcFile.exists) {
    return exitWithMessage({
      code: ExitCode.Error,
      fail: `.takeoffrc file not found, cannot run ${request.cmd}:${request.app}`,
    });
  }

  // Run the command and exit
  let result: CommandResult;
  try {
    result = await plugin.handler();
  } catch (e) {
    result = {
      code: ExitCode.Error,
      fail: e,
    };
  }

  return exitWithMessage(result);
};

run(process.cwd(), process.argv.slice(2));
