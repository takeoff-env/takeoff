#!/usr/bin/env node

const argv = require('minimist')(process.argv.slice(2));
const shellUtils = require('./../lib/shell-utils');

let blueprintName = 'basic';
if (argv.blueprintName) {
  blueprintName = argv.blueprintName;
}
let blueprint = `https://github.com/takeoff-env/takeoff-blueprint-${blueprintName}.git`;
let environment = 'takeoff';

if (argv.blueprint) {
  blueprint = argv.blueprint;
}

if (argv.env) {
  environment = argv.env;
}

const sleep = process.platform === 'win32' ? 'sleep -s 5' : 'sleep 5';
const mkdir =
  process.platform === 'win32'
    ? `cmd /c mkdir envs\\${environment}`
    : `mkdir -p envs/${environment}`;

const commands = [
  { cmd: mkdir, message: 'Creating environment' },
  { cmd: `git clone ${blueprint} envs/${environment}`, message: 'Cloning default environment' },
  argv.submodule
    ? { cmd: `git submodule init`, message: `Initialising submodules`, cwd: `envs/${environment}` }
    : undefined,
  argv.submodule
    ? { cmd: `git submodule update`, message: `Cloning submodules`, cwd: `envs/${environment}` }
    : undefined,
  argv.lerna
    ? { cmd: `lerna bootstrap`, message: 'Bootstrapping environments', cwd: `envs/${environment}` }
    : undefined,
  {
    cmd: `docker-compose -f docker/docker-compose.yml build --no-cache`,
    message: 'Running Docker Compose Build',
    cwd: `envs/${environment}`,
  },
  argv.dbinit
    ? {
        cmd: `docker-compose -f docker/docker-compose.yml up -d db`,
        message: 'Triggering database creation',
        cwd: `envs/${environment}`,
      }
    : undefined,
  argv.dbinit ? { cmd: `${sleep}`, message: 'Waiting for database' } : undefined,
  argv.dbinit
    ? {
        cmd: `docker-compose -f docker/docker-compose.yml stop db`,
        message: 'Shutting down database',
        cwd: `envs/${environment}`,
      }
    : undefined,
].filter(f => !!f);

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
  },
);
