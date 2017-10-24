#!/usr/bin/env node

const argv = require('minimist')(process.argv.slice(2));
const shellUtils = require('./../lib/shell-utils');

let envName = 'takeoff';

if (argv.env) {
    envName = argv.env;
}

const commands = [
    { cmd: `npm run compose:rm --env=${envName}`, message: 'Removing docker amis' },
    { cmd: `rm -rf envs/${envName}`, message: 'Removing default environment' }
];

shellUtils.series(
    commands,
    error => {
        if (error) {
            return console.error(`[Clean Environment]: ${error.message}`.trim());
        }
        console.log('Takeoff Clean Environment Done');
    },
    data => {
        if (argv.v) {
            console.log(`[Clean Environment]: ${data}`.trim());
        }
    },
    data => {
        console.log(`[Clean Environment]: ${data}`.trim());
    }
);
