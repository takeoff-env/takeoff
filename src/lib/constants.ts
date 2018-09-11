import { TableHeader } from "tables";

export const COMMAND_TABLE_HEADERS: TableHeader[] = [
  {
    width: 10,
    value: 'Command',
    align: 'left',
  },
  {
    width: 10,
    value: 'Arguments',
    align: 'left',
  },
  {
    width: 10,
    value: 'Options',
    align: 'left',
  },
  {
    width: 10,
    value: 'Description',
    align: 'left',
  },
];

export const DEFAULT_BLUEPRINT_NAME = 'basic';

export const SEVEN_DAYS = 60 * 60 * 24 * 7;
