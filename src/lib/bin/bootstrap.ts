import pjson from 'pjson';
import updateNotifier from 'update-notifier';
import { SEVEN_DAYS } from '../constants';

process.on('unhandledRejection', err => {
  /*eslint-disable */
  console.log(err.stack);
  process.exit(1);
  /*eslint-enable */
});

process.on('uncaughtException', error => {
  /*eslint-disable */
  console.log(error.stack); // to see your exception details in the console
  process.exit(1);
  /*eslint-enable */
});

const notifier = updateNotifier({
  pkg: pjson,
  updateCheckInterval: SEVEN_DAYS,
});

notifier.notify();
