#!/usr/bin/env node

const shellUtils = require('./../lib/shell-utils');

const commands = [
    'npm i ./api',
    'npm i ./app'
];

shellUtils.series(commands, (error) => {
    console.log(error);
});
