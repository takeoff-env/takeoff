#!/usr/bin/env node

const argv = require('minimist')(process.argv.slice(2));
const shellUtils = require('./../lib/shell-utils');

let sleep = 'sleep 5';
if (process.platform === 'win32') sleep = 'sleep -s 5';

let blueprint = 'https://github.com/takeoff-env/takeoff-blueprint-basic.git';
let envName = 'takeoff';

if (argv.blueprint) {
    blueprint = argv.blueprint;
}

if (argv.env) {
    envName = argv.env;
}

const commands = [
    { cmd: `mkdir -p envs/takeoff`, message: 'Creating environment' },
    { cmd: `git clone ${blueprint} envs/${envName}`, message: 'Cloning default environment' },
    argv.lerna ? { cmd: `lerna bootstrap`, message: 'Bootstrapping environments', cwd: `envs/${envName}` } : undefined,
    {
        cmd: `docker-compose -f docker/docker-compose.yml build --no-cache`,
        message: 'Running Docker Compose Build',
        cwd: `envs/${envName}`
    },
    {
        cmd: `docker-compose -f docker/docker-compose.yml up -d db`,
        message: 'Triggering database creation',
        cwd: `envs/${envName}`
    },
    { cmd: `${sleep}`, message: 'Waiting for database' },
    {
        cmd: `docker-compose -f docker/docker-compose.yml stop db`,
        message: 'Shutting down database',
        cwd: `envs/${envName}`
    }
].filter(f => f);

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
