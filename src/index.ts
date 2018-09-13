#!/usr/bin/env node

import './lib/bootstrap';

import chalk from 'chalk';
import minimist from 'minimist';
import shell from 'shelljs';
import updateNotifier from 'update-notifier';

import { SEVEN_DAYS } from './lib/constants';
import loadCommands from './lib/load-commands';

import { CommandResult } from 'commands';
import pjson from 'pjson';

import { ExitCode } from 'task';
import exitWithMessage from './lib/commands/exit-with-message';
import printMessage from './lib/commands/print-message';
import extractArguments from './lib/extract-arguments';
import renderHelp from './lib/help/render-help';
import loadRcFile from './lib/load-rc-file';

const notifier = updateNotifier({
  pkg: pjson,
  updateCheckInterval: SEVEN_DAYS,
});

const pathExists = (path: string) => shell.test('-e', path);

const run = async (workingDir: string, cliArgs: string[]) => {
  notifier.notify();

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
    takeoffCommands = await loadCommands([`${__dirname}/commands`, `${workingDir}/commands`], {
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
  const commandParts = (command && command.split(':')) || [];
  const request =
    commandParts.length > 1
      ? {
          app: commandParts[1],
          cmd: commandParts[0],
        }
      : { app: commandParts[0], cmd: 'takeoff' };

  if (!request.cmd || request.app === 'help') {
    return renderHelp(takeoffCommands, shell, request.app === 'help', args, pjson.version);
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
    throw e;
  }

  return exitWithMessage(
    result.code !== 0 ? result.fail : result.success || '',
    result.code,
    result.cmd ? (silent ? undefined : result.code ? result.cmd.stderr : result.cmd.stdout) : undefined,
  );
};

run(process.cwd(), process.argv.slice(2));
