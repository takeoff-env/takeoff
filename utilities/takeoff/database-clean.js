#!/usr/bin/env node

const argv = require('minimist')(process.argv.slice(2));
const shellUtils = require('./../lib/shell-utils');

const env = argv.env || 'dev';

const commands = [
    { cmd: `docker exec docker_api_1 node_modules/.bin/sequelize db:migrate:undo:all`, message: 'Removing migrations' },
    { cmd: `docker exec docker_api_1 node_modules/.bin/sequelize db:migrate`, message: 'Applying migrations' },
    { cmd: `docker exec docker_api_1 node_modules/.bin/sequelize db:seed:all`, message: 'Inserting seeds' }
];

shellUtils.series(
    commands,
    error => {
        if (error) {
            return console.error(`[Database Clean]: ${error.message}`.trim());
        }
        console.log('Database Clean Done');
    },
    data => {
        if (argv.v) {
            console.log(`[Database Clean]: ${data}`.trim());
        }
    },
    data => {
        console.log(`[Database Clean]: ${data}`.trim());
    }
);
