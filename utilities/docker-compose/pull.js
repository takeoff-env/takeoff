#!/usr/bin/env node

/**
 * takeoff-build command
 * To install this command run `npm link`
 * Build a docker compose environment
 * Usage:
 *  takeoff-build --env [env] -c -h
 * 
 * Parameters
 *  --env   [env]   The name of the docker-compose environment file to use
 *  -c, --cache     Use a cache when building (default is no cache)
 *  -v              Verbose log output
 */

const argv = require('minimist')(process.argv.slice(2));
const { spawn } = require('child_process');

let environment = 'takeoff';

if (argv.env) {
    environment = argv.env;
}

const command = 'docker-compose';

const args = ['-f', `envs/${environment}/docker/docker-compose.yml`, 'pull'];

console.log('Running Docker Pull Script');
console.log('---------------------------');

let result = spawn(command, args);

if (argv.v) {
    result.stdout.on('data', message => {
        console.log(`${message}`.trim());
    });
}

result.stderr.on('data', message => {
    console.error(`${message}`.trim());
});

result.on('exit', () => {
    console.log('Docker Build Done');
});
