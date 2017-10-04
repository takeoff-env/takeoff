#!/usr/bin/env node

/**
 * takeoff-down command
 * To install this command run `npm link`
 * Destroys any docker environments
 * Usage:
 *  takeoff-down --env [env] -d [name] -h
 * 
 * Parameters
 *  --env   [env]   The name of the docker-compose environment file to use
 *  -d      [name]  Names of service to destroy, for example db
 *  -v              Verbose log output
 */

const argv = require('minimist')(process.argv.slice(2));
const { spawn } = require('child_process');

let environment = 'takeoff';

if (argv.env) {
    environment = argv.env;
}

const command = 'docker-compose';

const args = ['-f', `envs/${environment}/docker-compose.yml`, 'down'];

if (argv.d && typeof argv.d === 'string') {
    args.push(argv.d);
}

console.log('Running Docker Down Script');
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
    console.log('Docker Down Done');
});
