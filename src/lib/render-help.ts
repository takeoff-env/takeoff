import { CommandOption, TakeoffCommand } from 'commands';

import { COMMAND_TABLE_HEADERS } from './constants';
import generateTable from './generate-table';

export = (takeoffCommands: Map<string, TakeoffCommand>, shell: any) => {
  const tableValues: Array<[string, string, string, string]> = [];

  takeoffCommands.forEach(({ command, args, group, options, description }) => {
    tableValues.push([
      group === 'takeoff' ? command : `${group}:${command}`,
      args || '',
      (options || []).map((o: CommandOption) => o.option.trim()).join('\n '),
      description,
    ]);
  });

  const table = generateTable(tableValues as any, COMMAND_TABLE_HEADERS, {
    align: 'left',
    borderStyle: 1,
    compact: false,
    headerAlign: 'left',
  });

  shell.echo(table.render());
  shell.exit(0);
};
