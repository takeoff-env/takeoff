import { ExitCode } from 'task';
import exitWithMessage from '../commands/exit-with-message';
import { COMMAND_TABLE_HEADERS } from '../constants';
import generateTable from '../generate-table';

/**
 * This renders the command table to the shell.
 *
 */
export = (group: string, command: string, groups: any, shell: any, headers = COMMAND_TABLE_HEADERS) => {
  let tableValues;
  if (command && command !== '') {
    if (!groups[group][command]) {
      return exitWithMessage(`Unable to find command ${group}:${command}`, ExitCode.Error);
    }
    const item = groups[group][command] || groups['takeoff'][group];
    tableValues = [[command, item.arguments, item.options, item.description]];
  } else {
    tableValues = Object.keys(groups[group]).map((key: string) => {
      const c = groups[group][key];
      return [key, c.arguments, c.options, c.description];
    });
  }
  const table = generateTable(tableValues as any, headers, {
    align: 'left',
    borderStyle: 0,
    compact: true,
    headerAlign: 'left',
  });

  shell.echo(table.render());
};
