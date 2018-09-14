#!/usr/bin/env node

import '../lib/bootstrap';

import minimist from 'minimist';
import pjson from 'pjson';
import shell from 'shelljs';

import { CommandResult } from 'commands';
import { TakeoffCmdParameters, TakeoffCommandRequest } from 'takeoff';
import { ExitCode } from 'task';

import exitWithMessage from '../lib/commands/exit-with-message';
import fileExists from '../lib/commands/file-exists';
import getCommandFromString from '../lib/commands/get-command-from-string';
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
  const { command, args, opts } = extractArguments(minimist(cliArgs));

  const silent = opts['v'] || opts['--verbose'] ? false : true;

  // Create out Takeoff object that can be passed to commands
  const takeoff: TakeoffCmdParameters = {
    args,
    command,
    exitWithMessage,
    fileExists,
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
    throw exitWithMessage('Unable to load commands', ExitCode.Error, e);
  }

  // Parse the request
  const request: TakeoffCommandRequest = getCommandFromString(command);
  if ((request.cmd === 'takeoff' && request.app === 'takeoff') || request.app === 'help') {
    return renderHelp(takeoffCommands, shell, args, pjson.version);
  }

  // Check if the command exists in the plugins
  const plugin = takeoffCommands.get(`${request.cmd}:${request.app}`);
  if (!plugin) {
    throw exitWithMessage(`${request.cmd}:${request.app} not found`, ExitCode.Error);
  }

  // Check if there is an RC file if the command doesn't allow it to be skipped
  if (!plugin.skipRcCheck && !takeoff.rcFile.exists) {
    throw exitWithMessage(`.takeoffrc file not found, cannot run ${request.cmd}:${request.app}`, ExitCode.Error);
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

  return exitWithMessage(
    result.code !== 0 ? result.fail : result.success || '',
    result.code,
    result.cmd ? (silent ? undefined : result.code ? result.cmd.stderr : result.cmd.stdout) : undefined,
  );
};

run(process.cwd(), process.argv.slice(2));
