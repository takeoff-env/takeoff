#!/usr/bin/env node

import '../lib/bootstrap';

import minimist from 'minimist';
import pjson from 'pjson';
import shell from 'shelljs';

import { CommandResult } from 'commands';
import { ExitCode } from 'task';

import exitWithMessage from '../lib/commands/exit-with-message';
import pathExists from '../lib/commands/path-exists';
import printMessage from '../lib/commands/print-message';
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

  const rcFile = loadRcFile(workingDir);

  const runCommand = (cmd: string, cwd: string = workingDir, disableSilent?: boolean) =>
    shell.exec(cmd, {
      cwd,
      silent: !disableSilent ? silent : false,
    });

  let takeoffCommands;
  try {
    takeoffCommands = await loadCommands([`${__dirname}/../commands`, `${workingDir}/commands`], {
      args,
      command,
      exitWithMessage,
      opts,
      pathExists,
      printMessage,
      rcFile,
      runCommand,
      shell,
      silent,
      workingDir,
    });
  } catch (e) {
    throw e;
  }
  const commandParts = (command && command.split(':')) || ['takeoff'];
  const request =
    commandParts.length > 1
      ? {
          app: commandParts[1],
          cmd: commandParts[0],
        }
      : { app: commandParts[0], cmd: 'takeoff' };

  if ((request.cmd === 'takeoff' && request.app === 'takeoff') || request.app === 'help') {
    return renderHelp(takeoffCommands, shell, args, pjson.version);
  }

  const plugin = takeoffCommands.get(`${request.cmd}:${request.app}`);
  if (!plugin) {
    return exitWithMessage(`${request.cmd}:${request.app} not found`, ExitCode.Error);
  }

  if (!plugin.skipRcCheck && !rcFile.exists) {
    return exitWithMessage(`.takeoffrc file not found, cannot run ${request.cmd}:${request.app}`, ExitCode.Error);
  }

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
