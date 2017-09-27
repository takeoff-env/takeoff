#!/usr/bin/env node

/**
 * takeoff-up command
 * To install this command run `npm link`
 * Triggers docker-compose up to run with the specified file name
 * Usage:
 *  takeoff-up --env [env] -d [name] -h
 * 
 * Parameters
 *  --env   [env]   The name of the docker-compose environment file to use
 *  -d      [name]  Names of service to start, for example db
 *  -h              Hide the verbose information from docker
 */

const argv = require('minimist')(process.argv.slice(2));
const { spawn } = require('child_process');

let env = argv.env || 'dev';

const command = 'docker-compose';

const args = ['-f', `envs/takeoff/docker/docker-compose.${env}.yml`, 'up'];

if (argv.d && typeof argv.d === 'string') {
    args.push('-d');
    args.push(argv.d);
}

console.log('Running Docker Up Script');
console.log('---------------------------');

let result = spawn(command, args);

if (!argv.h) {
    result.stdout.on('data', message => {
        console.log(`[Docker Up]: ${message}`.trim());
    });
}

result.stderr.on('data', message => {
    console.error(`[Docker Up]: ${message}`.trim());
});

result.on('exit', () => {
    console.log('Docker Up Done');
});
