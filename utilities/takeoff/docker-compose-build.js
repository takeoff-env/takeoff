#!/usr/bin/env node

const argv = require('minimist')(process.argv.slice(2));
const shellUtils = require('./../lib/shell-utils');

let sleep = 'sleep 5';
if (process.platform === 'win32') sleep = 'sleep -s 5';

const commands = [
    { cmd: `docker-compose -f docker/docker-compose.dev.yml build --no-cache`, message: 'Running Docker Compose Build' },
    { cmd: `docker-compose -f docker/docker-compose.dev.yml up -d db`, message: 'Triggering database creation' },
    { cmd: `${sleep}`, message: 'Waiting for database' },
    { cmd: `docker-compose -f docker/docker-compose.dev.yml stop db`, message: 'Shutting down database' }
];

shellUtils.series(
    commands,
    error => {
        if (error) {
            console.log(error);
            return console.error(`[Build]: ${error.message}`.trim());
        }
        console.log('Docker Compose Build Done');
    },
    data => {
        if (argv.v) {
            console.log(`[Build]: ${data}`.trim());
        }
    },
    data => {
        console.log(`[Build]: ${data}`.trim());
    }
);
