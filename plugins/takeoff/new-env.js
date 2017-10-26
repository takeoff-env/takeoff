const DEFAULT_BLUEPRINT_NAME = 'basic';

module.exports = {
    command: 'new',
    description: 'Creates a new environment',
    options: [
        {
            option: '-b, --blueprintUrl',
            description: 'Pass a git repository as a url for a blueprint'
        }
    ],
    args: '<name> [blueprint-name]',
    group: 'takeoff',
    handler: async ({ command, shell, args, opts, workingDir, h }) => {
        let [folderName, blueprintName] = args;

        if (!folderName) {
            shell.echo('You must pass a folder name');
            return shell.exit(1);
        }

        blueprintName = blueprintName || DEFAULT_BLUEPRINT_NAME;

        let cachedBlueprint = shell.test('-d', `${workingDir}/blueprints/${blueprintName}`);

        let blueprint =
            opts['b'] ||
            opts['blueprint-url'] ||
            (cachedBlueprint
                ? `${workingDir}/blueprints/${blueprintName}`
                : `https://github.com/takeoff-env/takeoff-blueprint-${blueprintName}.git`);
        let environment = folderName || 'default';

        shell.mkdir('-p', `${workingDir}/envs/${environment}`);
        const doClone = shell.exec(
            `git clone ${blueprint} ${workingDir}/envs/${environment} --depth 1 && rm -rf ${workingDir}/envs/${environment}/.git`
        );
        if (doClone.code !== 0) {
            shell.echo(`Error cloning ${blueprint}`, doClone.stdout);
            shell.exit(1);
        }

        try {
            shell.echo(`[Takeoff]: Running Takeoff Config`);
            const envFile = require(`${workingDir}/envs/${environment}/takeoff.config.js`);
            const runEnv = await envFile({ command, shell, args, opts, workingDir, h });
            if (runEnv) {
                return shell.exit(0);
            }
        } catch (e) {
          shell.echo(e.message);
          return shell.exit(1);
        }

        // let blueprintName = results[1] || 'basic';
        // //let blueprint = `https://github.com/takeoff-env/takeoff-blueprint-${blueprintName}.git`;
        // let blueprint = '../takeoff-blueprint-basic';
        // let environment = results[0] || 'takeoff';

        // shell.mkdir('-p', `envs/${environment}`);
        // const doClone = shell.exec(`git clone ${blueprint} envs/${environment} --depth 1`);
        // if (doClone.code !== 0) {
        //     shell.echo(`Error cloning ${blueprint}`, doClone.stdout);
        //     shell.exit(1);
        // }
        // shell.echo(`Cloned ${blueprint}`);

        // const envFile = require(`../../envs/${environment}/takeoff.config.js`)(environment);

        // envFile.forEach(command => {
        //     shell.echo(`[Takeoff]: ${command.message}`);
        //     const runCmd = shell.exec(command.cmd, { cwd: command.cwd, silent: true });
        //     if (runCmd.code !== 0) {
        //         shell.echo(`Error running ${command.cmd}`);
        //         shell.exit(1);
        //     }
        // });

        // shell.exit(0);
    }
};
