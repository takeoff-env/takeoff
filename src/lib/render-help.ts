import generateTable from './generate-table';
import { COMMAND_TABLE_HEADERS } from './constants';
import { TakeoffCommand, CommandOption } from 'commands';

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
    borderStyle: 1,
    compact: false,
    align: 'left',
    headerAlign: 'left',
  });

  shell.echo(table.render());
  shell.exit(0);
};
