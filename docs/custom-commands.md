# Takeoff Custom Commands

Adding custom commands to Takeoff is easy via the commands API. Inside the environment folder is a `commands` folders and in here you can drop in a TypeScript or JavaScript file that exports a `TakeoffCommand`

## Example Takeoff Command

Below is an example of a "Hello World" command.  The available injected features are documented in the comments.

```js
module.exports = ({
  args,             // The arguments passed to the command line
  command,          // The command being executed
  opts,             // A key/value of options
  pathExists,       // A function to check if a path exists, returns true or false
  printMessage,     // A Function to Print a message to the screen
  rcFile,           // An object of the rcRoot location, if it exists and the parsed properties
  runCommand,       // A function to run a command in the shell
  shell,            // A instance of shelljs for low level operations
  silent,           // If the takeoff command is being run as silent or verbose
  workingDir,       // The directory the command is being run in
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

    const [word] = args.length > 0 ? args: [''];

    if (word !== '') {
      cmd = `${cmd} ${word}`;
    }

    if (opts['w'] || opts['world']) {
      cmd = `${cmd} world`;
    }

    // Pass rcFile.rcRoot instead of working dir
    // to run from the environment folder
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
