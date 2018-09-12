#!/usr/bin/env node

import './lib/bootstrap';

import chalk from 'chalk';
import minimist from 'minimist';
import shell from 'shelljs';
import updateNotifier from 'update-notifier';

import { SEVEN_DAYS } from './lib/constants';
import loadCommands from './lib/load-commands';

import pjson from 'pjson';

import extractArguments from './lib/extract-arguments';
import rcCheck from './lib/rc-check';
import renderHelp from './lib/render-help';

const notifier = updateNotifier({
  pkg: pjson,
  updateCheckInterval: SEVEN_DAYS,
});

const printMessage = (message: string, stdout = '') => {
  const takeoffHeader = chalk.yellow('[Takeoff]');
  shell.echo(`${takeoffHeader} ${message}`, stdout);
};

const exitWithMessage = (message: string, code: number, stdout = '') => {
  let takeoffHeader = chalk.magenta('[Takeoff]');
  if (!Number.isNaN(code) && code > 0) {
    takeoffHeader = chalk.red('[Takeoff]');
  }
  shell.echo(`${takeoffHeader} ${message}`, stdout);

  if (!Number.isNaN(code) && code > -1) {
    shell.exit(code);
  }
};

const run = async (workingDir: string, cliArgs: string[]) => {
  shell.echo(`${chalk.magenta('Takeoff')} v${chalk.blueBright(pjson.version)}`);

  notifier.notify();

  const { command, args, opts } = extractArguments(minimist(cliArgs));

  const silent = opts['v'] || opts['--verbose'] ? false : true;

  const rcFile = rcCheck(workingDir);

  let takeoffCommands;
  try {
    takeoffCommands = await loadCommands([`${__dirname}/commands`, `${workingDir}/commands`], {
      args,
      command,
      exitWithMessage,
      opts,
      printMessage,
      rcFile,
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
          cmd: commandParts[1],
          group: commandParts[0],
        }
      : { group: 'takeoff', cmd: commandParts[0] };

  if (!request.cmd || request.cmd === 'help') {
    return renderHelp(takeoffCommands, shell, request.cmd === 'help', args);
  }

  const plugin = takeoffCommands.get(`${request.group}:${request.cmd}`);
  if (!plugin) {
    shell.echo(`${chalk.red('[Takeoff]')} ${chalk.cyan(`${request.group}:${request.cmd}`)} not found`);
    shell.exit(1);
  }

  if (!plugin.skipRcCheck && !rcFile.exists) {
    shell.echo(
      `${chalk.red('[Takeoff]')} .takeoffrc file not found, cannot run ${chalk.cyan(
        `${request.group}:${request.cmd}`,
      )}`,
    );
    shell.exit(1);
  }

  try {
    await plugin.handler();
  } catch (e) {
    throw e;
  }
};

run(process.cwd(), process.argv.slice(2));
