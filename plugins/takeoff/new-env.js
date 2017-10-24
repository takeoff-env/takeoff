module.exports = {
    command: 'new',
    description: 'Creates a new environment',
    options: [
        {
            option: '-b, --blueprintUrl',
            description: 'Pass a git repository as a url for a blueprint'
        }
    ],
    args: '[name] [blueprint-name]',
    group: 'takeoff',
    handler: async ({ results, shell }) => {
        let blueprintName = results[1] || 'basic';
        let blueprint = `https://github.com/takeoff-env/takeoff-blueprint-${blueprintName}.git`;
        let environment = results[0] || 'takeoff';

        shell.mkdir('-p', `envs/${environment}`);
        const doClone = shell.exec(`git clone ${blueprint} envs/${environment} --depth 1`);
        if (doClone.code !== 0) {
            shell.echo(`Error cloning ${blueprint}`, doClone.stdout);
            shell.exit(1);
        }
        shell.echo(`Cloned ${blueprint}`);
        shell.exit(0);

        // if (shell.exec(`npm run compose:rm -- --env=${arg}`).code !== 0) {
        //     shell.echo('Error with removing environments');
        //     shell.exit(1);
        // }

        // if (shell.exec(`rm -rf envs/${arg}`).code !== 0) {
        //     shell.echo('Error with removing environments');
        //     shell.exit(1);
        // }
        // shell.echo(`Successfully removed ${arg}`);
        // shell.exit(0);
    }
};
