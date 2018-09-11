#!/usr/bin/env node

import './lib/bootstrap';
import pkg from '../package.json';

import updateNotifier from 'update-notifier';
import minimist from 'minimist';
import shell from 'shelljs';
import chalk from 'chalk';

import { SEVEN_DAYS } from './lib/constants';
import loadCommands from './lib/load-commands';

import extractArguments from './lib/extract-arguments';
import renderHelp from './lib/render-help';
import rcCheck from './lib/rc-check';

const notifier = updateNotifier({
  pkg,
  updateCheckInterval: SEVEN_DAYS,
});

const printMessage = (message: string, stdout = '') => {
  let takeoffHeader = chalk.yellow('[Takeoff]');
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
  shell.echo(`${chalk.magenta('Takeoff')} v${chalk.blueBright(pkg.version)}`);

  notifier.notify();

  const { command, args, opts } = extractArguments(minimist(cliArgs));

  let takeoffCommands;
  try {
    takeoffCommands = await loadCommands(`${__dirname}/commands`, {
      shell,
      exitWithMessage,
      printMessage,
      command,
      args,
      opts,
      workingDir,
    });
  } catch (e) {
    throw e;
  }
  const commandParts = (command && command.split(':')) || [];
  const run =
    commandParts.length > 1
      ? {
          group: commandParts[0],
          cmd: commandParts[1],
        }
      : { group: 'takeoff', cmd: commandParts[0] };

  if (!run.cmd || run.cmd === 'help') {
    return renderHelp(takeoffCommands, shell);
  }

  const plugin = takeoffCommands.get(`${run.group}:${run.cmd}`);
  if (!plugin) {
    shell.echo(`${chalk.red('[Takeoff]')} ${chalk.cyan(`${run.group}:${run.cmd}`)} not found`);
    shell.exit(1);
  }

  if (!plugin.skipRcCheck) {
    rcCheck(workingDir);
  }

  try {
    await plugin.handler();
  } catch (e) {
    throw e;
  }
};

run(process.cwd(), process.argv.slice(2));
