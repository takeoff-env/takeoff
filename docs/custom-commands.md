# Takeoff Custom Commands

Adding custom commands to Takeoff is easy via the commands API. Inside the environment folder is a `commands` folders and in here you can drop in a TypeScript or JavaScript file that exports a `TakeoffCommand`

## Example Takeoff Command

Below is an example of a "Hello World" command.  The available injected features are documented in the comments.

```js
module.exports = ({
  args,             // The arguments passed to the command line
  command,          // The command being executed
  exitWithMessage,  // A function that can be called to exit the ap
  opts,
  pathExists,
  printMessage,
  rcFile,
  runCommand,
  shell,
  silent,
  workingDir,
  command, // The command being run as a string
  workingDir, // The directory the command is being run in
  args, // A object map of key/val args
  opts, // A object map of key/val options
  printMessage, // A function to print to the console, takes a string,
  rcFile // Object with .takeoffrc file data
  runCommand // Run a command in the shell and get back the result
}) => ({
    /**
     * The below command is available via
     * > takeoff myapp:my-command -w
     */
  command: 'my-command',
  description: 'A custom greeting command',
  args: '[word]',
  options: [{
    option: '-w, --world',
    description: 'Add world to the output'
  }],
  group: 'myapp',
  handler() {
    printMessage(`My script does something`);

    let cmd = 'echo Hello';

    const [word] = args.length > 0 ? args: [false];

    if (word) {
      cmd = `${cmd} ${word}`;
    }

    if (opts['w'] || opts['world']) {
      cmd = `${cmd} world`;
    }

    const runCmd = runCommand(cmd, workingDir);

    return {
      cmd: runCmd,
      code: runCmd.code,
      fail: 'Error running command',
      success: 'Successfully ran command',
    };
  }
});
```

This can now be run as `takeoff myapp:my-command dev -w` and will print `Hello dev world`
