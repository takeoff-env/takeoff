#!/usr/bin/env node

/**
 * takeoff-rm command
 * To install this command run `npm link`
 * Cleans up the environment
 * Usage:
 *  takeoff-rm --env [env] -c -h
 * 
 * Parameters
 *  --env   [env]   The name of the docker-compose environment file to use
 *  -v              Verbose log output
 */

const argv = require('minimist')(process.argv.slice(2));
const { spawn } = require('child_process');

let env = argv.env || 'takeoff';

const command = 'docker-compose';

const args = ['-f', `envs/${env}/docker/docker-compose.yml`, 'down', '--rmi', 'all'];

console.log('Running Docker Uninstall Script');
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
    console.log('Docker Uninstall Done');
});
