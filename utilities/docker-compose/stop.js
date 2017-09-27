#!/usr/bin/env node

/**
 * takeoff-top command
 * To install this command run `npm link`
 * Stops any running docker environments
 * Usage:
 *  takeoff-top --env [env] -d [name] -h
 * 
 * Parameters
 *  --env   [env]   The name of the docker-compose environment file to use
 *  -d      [name]  Names of service to stop, for example db
 *  -v              Verbose log output
 */

const argv = require('minimist')(process.argv.slice(2));
const { spawn } = require('child_process');

let env = argv.env || 'takeoff';

const command = 'docker-compose';

const args = ['-f', `envs/${env}/docker/docker-compose.yml`, 'stop'];

if (argv.d && typeof argv.d === 'string') {
    args.push(argv.d);
}

console.log('Running Docker Stop Script');
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
    console.log('Docker Stop Done');
});
