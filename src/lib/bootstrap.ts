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
