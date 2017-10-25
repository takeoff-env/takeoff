module.exports = {
  command: 'init',
  description: 'Creates a new environment container',
  options: [
    {
      option: '-b, --blueprintUrl',
      description: 'Pass a git repository as a url for a blueprint to begin the default with',
    },
  ],
  args: '<name> [blueprint-name]',
  group: 'takeoff',
  handler: async ({ command, shell, args, workingDir }) => {
    
    let [folderName, blueprintName] = args;

    if (!folderName) {
      shell.echo('You must pass a folder name');
    }

    blueprintName = blueprintName || 'basic';

    shell.echo(`Creating folder ${folderName}`);
    shell.mkdir('-p', [
      `${workingDir}/${folderName}`,
      `${workingDir}/${folderName}/blueprints`,
      `${workingDir}/${folderName}/envs`,
    ]);

    //let blueprint = `https://github.com/takeoff-env/takeoff-blueprint-${blueprintName}.git`;
    let blueprint = `/home/tane/work/takeoff-blueprint-${blueprintName}`;
    let environment = 'default';

    if (!shell.test('-d', `${workingDir}/${folderName}/blueprints/${blueprintName}`)) {
      shell.mkdir('-p', `${workingDir}/${folderName}/blueprints/${blueprintName}`);
      const doClone = shell.exec(
        `git clone ${blueprint} ${workingDir}/${folderName}/blueprints/${blueprintName} --depth 1`,
      );
      if (doClone.code !== 0) {
        shell.echo(`Error cloning ${blueprint}`, doClone.stdout);
        shell.exit(1);
      }
      shell.echo(`Cloned ${blueprint} to cache`);
    }

    shell.mkdir('-p', `${workingDir}/${folderName}/envs/${environment}`);
    const doClone = shell.exec(
      `git clone ${workingDir}/${folderName}/blueprints/${blueprintName} ${workingDir}/${folderName}/envs/${environment} --depth 1`,
    );
    if (doClone.code !== 0) {
      shell.echo(`Error cloning ${blueprint}`, doClone.stdout);
      shell.exit(1);
    }
    shell.echo(`${workingDir}/${folderName}/blueprints/${blueprintName} ${workingDir}/${folderName}/envs/${environment}`);

    const envFile = require(`${workingDir}/${folderName}/envs/${environment}/takeoff.config.js`)(
      environment,
    );

    envFile.forEach(command => {
      shell.echo(`[Takeoff]: ${command.message}`);
      const dir = `${workingDir}/${folderName}/envs/${environment}`;
      const runCmd = shell.exec(command.cmd, { cwd: dir, silent: false });
      if (runCmd.code !== 0) {
        shell.echo(`Error running ${command.cmd}`);
        shell.exit(1);
      }
    });

    shell.exit(0);
  },
};
