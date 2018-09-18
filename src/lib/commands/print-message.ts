import chalk from 'chalk';
import shell from 'shelljs';
import { ChalkWithIndex, PrintMessageOptions } from 'takeoff';

export = (message = 'You can use this to print a custom message', stdout?: any, options?: PrintMessageOptions) => {
  const opts = { header: '[Takeoff]', spacer: ' ', headerColour: 'yellow', textColour: 'white', ...options };

  const headerText = (chalk as ChalkWithIndex)[opts.headerColour](opts.header);
  const text = (chalk as ChalkWithIndex)[opts.textColour](message);
  shell.echo(`${headerText}${opts.spacer}${text}`, (stdout && '\n') || '', (stdout && stdout) || '');
};
