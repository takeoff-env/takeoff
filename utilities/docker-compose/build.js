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

let env = argv.env || 'dev';

const command = 'docker-compose';

const args = ['-f', `docker/docker-compose.${env}.yml`, 'build'];
if (!argv.c || !argv.cache) args.push('--no-cache');

console.log('Running Docker Build Script');
console.log('---------------------------');

let result = spawn(command, args);

if (argv.v) {
    result.stdout.on('data', message => {
        console.log(`[Docker Build]: ${message}`.trim());
    });
}

result.stderr.on('data', message => {
    console.error(`[Docker Build]: ${message}`.trim());
});

result.on('exit', () => {
    console.log('Docker Build Done');
});
