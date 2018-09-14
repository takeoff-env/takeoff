import shell from 'shelljs';
import printMessage from './print-message';

export = (message: string, code: number, stdout = '') => {
  if (!Number.isNaN(code) && code > 0) {
    printMessage(message, stdout, {
      headerColour: 'red',
      textColour: 'white',
    });
  } else {
    printMessage(message, stdout, {
      headerColour: 'green',
      textColour: 'white',
    });
  }

  if (!Number.isNaN(code) && code > -1) {
    shell.exit(code);
  }
};
