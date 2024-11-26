import { TakeoffResult } from 'commands';
import shell from 'shelljs';
import printMessage from './print-message';

export = ({ code = 0, success = 'Exited Takeoff', fail = '', extra = '' }: TakeoffResult) => {
  if (!Number.isNaN(code) && code > 0) {
    printMessage(fail, extra, { headerColour: 'red', textColour: 'white' });
  } else {
    printMessage(success, extra, { headerColour: 'green', textColour: 'white' });
  }

  if (!Number.isNaN(code) && code > -1) {
    shell.exit(code);
  }
};
