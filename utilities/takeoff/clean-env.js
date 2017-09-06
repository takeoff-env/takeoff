#!/usr/bin/env node

const argv = require('minimist')(process.argv.slice(2));
const shellUtils = require('./../lib/shell-utils');

const env = argv.env || 'dev';

const commands = [
    `rm -rf api/node_modules`,
    `rm -rf app/node_modules`,
    `npm run to:compose:rm`
];

console.log(`Takeoff Clean Environment`);
console.log(`----------------------------`);

shellUtils.series(commands, (error) => {
    if (error) {
        return console.error(`[Clean Environment]: ${error.message}`.trim())
    }
    console.log('Takeoff Clean Environment Done');
}, (data) => {
    if (argv.v) {
        console.log(`[Clean Environment]: ${data}`.trim())
    }
});
