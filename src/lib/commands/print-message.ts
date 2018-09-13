import chalk from 'chalk';
import shell from 'shelljs';
import { ChalkWithIndex } from 'takeoff';

export = (
  message = 'You can use this to print a custom message',
  stdout?: any,
  options = { headerColour: 'yellow', textColour: 'white' },
  header = '[Takeoff]',
  spacer = ' ',
) => {
  const headerText = (chalk as ChalkWithIndex)[options.headerColour](header);
  const text = (chalk as ChalkWithIndex)[options.textColour](message);
  shell.echo(`${headerText}${spacer}${text}`, (stdout && '\n') || '', (stdout && stdout) || '');
};
