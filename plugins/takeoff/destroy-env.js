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
    handler: async ({ results, shell }) => {
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

// const argv = require('minimist')(process.argv.slice(2));
// const shellUtils = require('./../lib/shell-utils');

// let envName = 'takeoff';

// if (argv.env) {
//     envName = argv.env;
// }

// const commands = [
//     { cmd: `npm run compose:rm --env=${envName}`, message: 'Removing docker amis' },
//     { cmd: `rm -rf envs/${envName}`, message: 'Removing default environment' }
// ];

// shellUtils.series(
//     commands,
//     error => {
//         if (error) {
//             return console.error(`[Clean Environment]: ${error.message}`.trim());
//         }
//         console.log('Takeoff Clean Environment Done');
//     },
//     data => {
//         if (argv.v) {
//             console.log(`[Clean Environment]: ${data}`.trim());
//         }
//     },
//     data => {
//         console.log(`[Clean Environment]: ${data}`.trim());
//     }
// );
