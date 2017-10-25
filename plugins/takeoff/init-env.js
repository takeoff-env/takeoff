const DEFAULT_BLUEPRINT_NAME = 'basic';

module.exports = {
    command: 'init',
    description: 'Creates a new environment container',
    options: [
        {
            option: '-b, --blueprint-url',
            description: 'Pass a git repository as a url for a blueprint to begin the default with'
        },
        {
            option: '-n, --no-default',
            description: 'Pass a git repository as a url for a blueprint to begin the default with'
        }
    ],
    args: '<name> [blueprint-name]',
    group: 'takeoff',
    handler: async ({ command, shell, args, opts, workingDir, ProgressBar }) => {
        let [folderName, blueprintName] = args;

        if (!folderName) {
            shell.echo('You must pass a folder name');
            return shell.exit(1);
        }

        blueprintName = blueprintName || DEFAULT_BLUEPRINT_NAME;

        shell.echo(`Creating folder ${folderName}`);
        shell.mkdir('-p', [
            `${workingDir}/${folderName}`,
            `${workingDir}/${folderName}/blueprints`,
            `${workingDir}/${folderName}/envs`
        ]);

        let blueprint = opts['blueprint-url'] || `https://github.com/takeoff-env/takeoff-blueprint-${blueprintName}.git`;
        let environment = 'default';

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
        const doClone = shell.exec(
            `git clone ${workingDir}/${folderName}/blueprints/${blueprintName} ${workingDir}/${folderName}/envs/${environment} --depth 1`
        );
        if (doClone.code !== 0) {
            shell.echo(`Error cloning ${blueprint}`, doClone.stdout);
            shell.exit(1);
        }

        try {
            shell.echo(`[Takeoff]: Running Takeoff Config`);
            const envFile = require(`${workingDir}/${folderName}/envs/${environment}/takeoff.config.js`);
            const runEnv = await envFile({ command, shell, args, opts, workingDir, ProgressBar });
            if (runEnv) {
                return shell.exit(0);
            }
        } catch (e) {
          shell.echo(e.message);
          return shell.exit(1);
        }
    }
};
