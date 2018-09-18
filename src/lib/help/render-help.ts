import chalk from 'chalk';
import { CommandOption, TakeoffCommand } from 'commands';

import { ExitCode } from 'task';
import exitWithMessage from '../helpers/exit-with-message';
import printMessage from '../helpers/print-message';
import renderTable from './render-table';

export = (takeoffCommands: Map<string, TakeoffCommand>, shell: any, cliArgs: any, version: string) => {
  const [helpCommand]: string[] = cliArgs.length > 0 ? cliArgs : ['takeoff'];
  printMessage(`Version ${chalk.blueBright(version)}`);

  const helpGroupParts = helpCommand.split(':');
  const helpGroup = helpGroupParts[0];
  const app = helpGroupParts.length > 1 ? helpGroupParts[1] : '';

  // Build an object of all the groups and their commands
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

  if (['takeoff'].includes(helpGroup)) {
    printMessage(
      `Welcome to Takeoff. Below is a list of commands you can run, and a list of groups which contain commands.`,
    );
    printMessage(
      `For group help type ${chalk.underline('takeoff help [group]')} or type ${chalk.underline(
        'takeoff [group:command]',
      )}`,
    );
    printMessage(`${groupKeys.reduce((result: string, key: string) => `${result} - ${key}\n`, '')}`, null, {
      header: '',
      headerColour: 'blue',
      spacer: '',
      textColour: 'white',
    });
    printMessage('Showing default Takeoff Basic CLI Commands', null, {
      headerColour: 'blue',
      textColour: 'white',
    });
    renderTable('takeoff', app, groups, shell);
  } else if (!groups[helpGroup]) {
    exitWithMessage({ code: ExitCode.Error, fail: `No help found for command ${helpGroup}` });
  } else {
    printMessage(`Showing CLI Commands for ${helpGroup}`, null, {
      headerColour: 'blue',
      textColour: 'white',
    });
    renderTable(helpGroup, app, groups, shell);
  }
  shell.exit(0);
};
