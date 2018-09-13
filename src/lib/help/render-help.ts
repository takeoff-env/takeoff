import chalk from 'chalk';
import { CommandOption, TakeoffCommand } from 'commands';

import { COMMAND_TABLE_HEADERS } from '../constants';
import generateTable from '../generate-table';

import takeoffHelp from './group-help';

export = (takeoffCommands: Map<string, TakeoffCommand>, shell: any, isHelpCommand: boolean, cliArgs: any) => {
  const [helpGroup]: string[] = cliArgs.length > 0 ? cliArgs : ['default'];
  shell.echo(`Welcome to ${chalk.magentaBright('Takeoff!')}`);

  const groups: any = {};

  takeoffCommands.forEach(({ command, args, group, options, description }) => {
    if (!groups[group]) {
      groups[group] = {};
    }
    groups[group][command] = {
      arguments: args || '',
      description,
      group: group === 'takeoff' ? command : `${group}:${command}`,
      options: (options || []).map((o: CommandOption) => o.option.trim()).join('\n '),
    };
  });
  const groupKeys = Object.keys(groups);
  shell.echo(
    `\nFor group help type ${chalk.underline('takeoff help [group]')} or type ${chalk.underline(
      'takeoff [group:command]',
    )}`,
  );
  shell.echo(`${groupKeys.reduce((result: string, key: string) => `${result} - ${key}\n`, '')}`);

  if (['default', 'help', 'takeoff'].includes(helpGroup)) {
    shell.echo(`${chalk.blueBright('Showing default Takeoff Basic CLI Commands')}`);
    shell.echo(takeoffHelp('takeoff', groups));
  } else if (!groups[helpGroup]) {
    shell.echo(`${chalk.red('[Takeoff]')} No help for ${helpGroup}`);
    shell.exit(1);
  } else {
    shell.echo(`${chalk.blueBright('Showing ${helpGroup} CLI Commands')}`);
    shell.echo(takeoffHelp(helpGroup, groups));
  }
  shell.exit(0);
};
