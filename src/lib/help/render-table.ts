import { ExitCode } from 'task';
import { COMMAND_TABLE_HEADERS } from '../constants';
import exitWithMessage from '../helpers/exit-with-message';
import generateTable from '../helpers/generate-table';

/**
 * This renders the command table to the shell.
 *
 */
export = (group: string, command: string, groups: any, shell: any, headers = COMMAND_TABLE_HEADERS) => {
  let tableValues;
  if (command && command !== '') {
    if (!groups[group][command]) {
      return exitWithMessage({ code: ExitCode.Error, fail: `Unable to find command ${group}:${command}` });
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
