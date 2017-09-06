#!/usr/bin/env node

const argv = require('minimist')(process.argv.slice(2));
const shellUtils = require('./../lib/shell-utils');

const env = argv.env || 'dev';

const commands = [
    { cmd: `rm -rf api/node_modules`, message: 'Removing api node_modules' },
    { cmd: `rm -rf app/node_modules`, message: 'Removing app node_modules' },
    { cmd: `npm run compose:rm`, message: 'Removing docker amis' }
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
