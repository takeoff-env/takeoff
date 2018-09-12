import chalk from 'chalk';
import { CommandOption, TakeoffCommand } from 'commands';

import { COMMAND_TABLE_HEADERS } from './constants';
import generateTable from './generate-table';

export = (takeoffCommands: Map<string, TakeoffCommand>, shell: any, isHelpCommand: boolean, cliArgs: any) => {
  const [helpGroup]: string[] = cliArgs.length > 0 ? cliArgs : ['default'];
  console.log(helpGroup);

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

  let table;
  let tableValues;

  if (['default', 'help', 'takeoff'].includes(helpGroup)) {
    tableValues = Object.keys(groups['takeoff']).map((key: string) => {
      const c = groups['takeoff'][key];
      return [key, c.arguments, c.options, c.description];
    });

    table = generateTable(tableValues as any, COMMAND_TABLE_HEADERS, {
      align: 'left',
      borderStyle: 0,
      compact: true,
      headerAlign: 'left',
    });
  } else if (!groups[helpGroup]) {
    shell.echo(`${chalk.red('[Takeoff]')} No help for ${helpGroup}`);
    shell.exit(1);
  } else {
    tableValues = Object.keys(groups[helpGroup]).map((key: string) => {
      const c = groups[helpGroup][key];
      return [`${helpGroup}:${key}`, c.arguments, c.options, c.description];
    });

    table = generateTable(tableValues as any, COMMAND_TABLE_HEADERS, {
      align: 'left',
      borderStyle: 0,
      compact: true,
      headerAlign: 'left',
    });
  }

  shell.echo(
    `The available command groups are available.\nFor subcommands type ${chalk.underline('takeoff help [command]')}`,
  );
  shell.echo(`${groupKeys.reduce((result: string, key: string) => `${result} - ${key}\n`, '')}`);

  shell.echo(`${chalk.blueBright('Showing default Takeoff Basic CLI Commands')}`);
  shell.echo(table.render());
  shell.exit(0);
};
