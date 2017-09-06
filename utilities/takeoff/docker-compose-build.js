#!/usr/bin/env node

const argv = require('minimist')(process.argv.slice(2));
const shellUtils = require('./../lib/shell-utils');

let sleep = 'sleep 5';
if (process.platform === 'win32') sleep = 'sleep -s 5';

const commands = [
    `docker-compose -f docker/docker-compose.dev.yml build --no-cache`,
    `docker-compose -f docker/docker-compose.dev.yml up -d db`,
    `${sleep}`,
    `docker-compose -f docker/docker-compose.dev.yml stop db`
];

console.log(`Running Docker Compose Build`);
console.log(`----------------------------`);

shellUtils.series(commands, (error) => {
    if (error) {
        return console.error(`[Docker Compose Build]: ${error.message}`.trim())
    }
    console.log('Docker Compose Build Done');
}, (data) => {
    if (argv.v) {
        console.log(`[Docker Compose Build]: ${data}`.trim())
    }
});
