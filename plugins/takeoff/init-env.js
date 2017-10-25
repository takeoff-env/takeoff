module.exports = {
    command: 'init',
    description: 'Creates a new environment container',
    options: [
        {
            option: '-b, --blueprintUrl',
            description: 'Pass a git repository as a url for a blueprint to begin the default with'
        }
    ],
    args: '<name> [blueprint-name]',
    group: 'takeoff',
    handler: async ({ command, shell, args, workingDir }) => {
        console.log(command, args);
        const folderName = command;
        if (!folderName) {
            shell.echo('You must pass')
        }
        shell.echo(`Creating folder ${folderName}`);
        shell.mkdir('-p', [
            `${workingDir}/${folderName}`,
            `${workingDir}/${folderName}/blueprints`,
            `${workingDir}/${folderName}/envs`
        ]);

        let blueprintName = args[1] || 'basic';
        //let blueprint = `https://github.com/takeoff-env/takeoff-blueprint-${blueprintName}.git`;
        let blueprint = '/home/tane/work/takeoff-blueprint-basic';
        let environment = command ;

        if (!shell.test('-d', `${workingDir}/${folderName}/blueprints/${blueprintName}`)) {
            shell.mkdir('-p', `${workingDir}/${folderName}/blueprints/${blueprintName}`);
            const doClone = shell.exec(
                `git clone ${blueprint} ${workingDir}/${folderName}/blueprints/${blueprintName} --depth 1`
            );
            if (doClone.code !== 0) {
                shell.echo(`Error cloning ${blueprint}`, doClone.stdout);
                shell.exit(1);
            }
            shell.echo(`Cloned ${blueprint} to cache`);
        }

        shell.mkdir('-p', `${workingDir}/${folderName}/envs/${environment}`);
        const doClone = shell.exec(`git clone ${workingDir}/${folderName}/blueprints/${blueprintName} ${workingDir}/${folderName}/envs/${environment} --depth 1`);
        if (doClone.code !== 0) {
            shell.echo(`Error cloning ${blueprint}`, doClone.stdout);
            shell.exit(1);
        }
        shell.echo(`Cloned ${blueprint}`);

        const envFile = require(`${workingDir}/${folderName}/envs/${environment}/takeoff.config.js`)(environment);

        envFile.forEach(command => {
            shell.echo(`[Takeoff]: ${command.message}`);
            const dir = `${workingDir}/${folderName}/envs/${environment}`;
            console.log(dir);
            const runCmd = shell.exec(command.cmd, { cwd: dir, silent: false });
            if (runCmd.code !== 0) {
                shell.echo(`Error running ${command.cmd}`);
                shell.exit(1);
            }
        });

        shell.exit(0);
    }
};
