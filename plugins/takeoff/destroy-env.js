#!/usr/bin/env node

module.exports = {
    command: 'destroy',
    description: 'Destroys an environment. This is non-reversable.',
    options: [
        {
            option: '-d, --dry',
            description: "Do a dry run and don't actually destroy environment"
        }
    ],
    args: '<name>',
    group: 'takeoff',
    handler: async ({ command, shell, args, workingDir }) => {
        if (shell.exec(`npm run compose:rm -- --env=${results[0]}`).code !== 0) {
            shell.echo('Error with removing environments');
            shell.exit(1);
        }

        if (shell.exec(`rm -rf envs/${results[0]}`).code !== 0) {
            shell.echo('Error with removing environments');
            shell.exit(1);
        }
        shell.echo(`Successfully removed ${results[0]}`);
        shell.exit(0);
    }
};
