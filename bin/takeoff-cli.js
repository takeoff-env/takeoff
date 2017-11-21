#!/usr/bin/env node

process.on('unhandledRejection', err => {
    /*eslint-disable */
    console.log(err.stack);
    process.exit(1);
    /*eslint-enable */
});

process.on('uncaughtException', error => {
    /*eslint-disable */
    console.log(error.stack); // to see your exception details in the console
    process.exit(1);
    /*eslint-enable */
});

const updateNotifier = require('update-notifier');
const pkg = require('./../package.json');

const notifier = updateNotifier({
    pkg,
    updateCheckInterval: 1000 * 60 * 60 * 24
});

const argv = require('minimist')(process.argv.slice(2));
const shell = require('shelljs');

const { COMMAND_TABLE_HEADERS } = require('./constants');

const { getPluginsForDir, createTable, h, extractArguments } = require('./lib');

// instantiate

const workingDir = process.cwd();

const plugins = [];

const init = async () => {
    shell.echo(`Takeoff v${pkg.version}`);

    notifier.notify();

    const pluginPaths = await getPluginsForDir();
    pluginPaths.forEach(pluginPath => {
        try {
            const plugin = require(pluginPath);
            plugins.push(plugin);
        } catch (e) {
            shell.echo(`Unable to load plugin ${pluginPath}`);
        }
    });

    const { command, args, opts } = extractArguments(argv);
    const tableValues = [];

    if (!command || command === 'help') {
        plugins.forEach(({ command, args, group, handler, options, description }) => {
            tableValues.push([command, args, (options || []).map(o => o.option).join('\n'), description]);
        });

        const table = createTable(COMMAND_TABLE_HEADERS, tableValues, {
            borderStyle: 0,
            compact: true,
            align: 'left',
            headerAlign: 'left'
        });
        shell.echo(table.render());
        shell.exit(0);
    }

    const plugin = plugins.find(plugin => plugin.command === argv._[0]);
    if (!plugin) {
        shell.echo(`Error: Plugin not found`);
        shell.exit(1);
    }
    plugin.handler({ command, args, opts, shell, workingDir, h });
};

init();
