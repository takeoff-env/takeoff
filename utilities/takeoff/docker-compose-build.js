#!/usr/bin/env node

const argv = require('minimist')(process.argv.slice(2));
const shellUtils = require('./../lib/shell-utils');

let sleep = 'sleep 5';
if (process.platform === 'win32') sleep = 'sleep -s 5';

let blueprintName = 'basic';
if (argv.blueprintName) {
    blueprintName = argv.blueprintName
}
let blueprint = `https://github.com/takeoff-env/takeoff-blueprint-${blueprintName}.git`;
let environment = 'takeoff';

if (argv.blueprint) {
    blueprint = argv.blueprint;
}

if (argv.env) {
    environment = argv.env;
}

const commands = [
    { cmd: `mkdir -p envs/${environment}`, message: 'Creating environment' },
    { cmd: `git clone ${defaultRepo} envs/${environment}`, message: 'Cloning default environment' },
    argv.submodule ? { cmd: `git submodule init`, message: `Initialising submodules`, cwd: `envs/${environment}`} : undefined,
    argv.submodule ? { cmd: `git submodule update`, message: `Cloning submodules`, cwd: `envs/${environment}`} : undefined,
    argv.lerna ? { cmd: `lerna bootstrap`, message: 'Bootstrapping environments', cwd: `envs/${environment}` } : undefined,
    {
        cmd: `docker-compose -f docker/docker-compose.yml build --no-cache`,
        message: 'Running Docker Compose Build',
        cwd: `envs/${environment}`
    },
    {
        cmd: `docker-compose -f docker/docker-compose.yml up -d db`,
        message: 'Triggering database creation',
        cwd: `envs/${environment}`
    },
    { cmd: `${sleep}`, message: 'Waiting for database' },
    {
        cmd: `docker-compose -f docker/docker-compose.yml stop db`,
        message: 'Shutting down database',
        cwd: `envs/${environment}`
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
