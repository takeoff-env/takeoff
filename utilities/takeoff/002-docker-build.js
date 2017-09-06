#!/usr/bin/env node

const shellUtils = require('./../lib/shell-utils');

const commands = [
    'docker-compose -f docker/docker-compose.dev.yml build --no-cache',
    'docker-compose -f docker/docker-compose.dev.yml up -d db',
    'sleep 5',
    'docker-compose -f docker/docker-compose.dev.yml stop db'
];

shellUtils.series(commands, (error) => {
    console.log(error);
});
