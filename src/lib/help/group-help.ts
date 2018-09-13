import { COMMAND_TABLE_HEADERS } from '../constants';
import generateTable from '../generate-table';

export = (groupName: string, groups: any) => {
  const tableValues = Object.keys(groups[groupName]).map((key: string) => {
    const c = groups[groupName][key];
    return [key, c.arguments, c.options, c.description];
  });

  const table = generateTable(tableValues as any, COMMAND_TABLE_HEADERS, {
    align: 'left',
    borderStyle: 0,
    compact: true,
    headerAlign: 'left',
  });

  return table.render();
};
