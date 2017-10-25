#!/usr/bin/env node

const argv = require('minimist')(process.argv.slice(2));
const glob = require('glob-promise');
const Path = require('path');
const shell = require('shelljs');
var Table = require('cli-table');

// instantiate
var commandsTable = new Table({
    head: ['Command', 'Arguments', 'Description'],
    colWidths: [30, 40, 50]
});

const pkg = require('../package.json');
const lib = require('./lib');

const workingDir = process.cwd();

const plugins = [];

const getPluginsForDir = async (baseDir = `${__dirname}/../plugins`) => {
    // Do all the pre-plugin loading
    const basePluginPath = Path.normalize(baseDir);
    let pluginPaths = [];
    try {
        pluginPaths = await glob('**/*.js', { cwd: basePluginPath });
    } catch (e) {
        throw e;
    }
    return pluginPaths.map(plugin => `${basePluginPath}/${plugin}`);
};

const init = async () => {
    const pluginPaths = await getPluginsForDir();
    //console.log(pluginPaths);

    pluginPaths.forEach(pluginPath => {
        const plugin = require(pluginPath);
        plugins.push(plugin);

        // takeoff
        //     .command(`${command}` + (args ? ` ${args}` : ''))
        //     .description(description)
        //     .action((command, ...pluginArgs) => {
        //         const [...results] = pluginArgs.splice(0, pluginArgs.length - 1);
        //         handler({ takeoff, command, results, shell, workingDir });
        //     });

        // options.forEach(option => {
        //     takeoff.option(option.option, option.description);
        // });
    });

    shell.echo(`Takeoff ${pkg.version}`);

    const [command, ...args] = argv._;

    if (!command || command === 'help') {
        plugins.forEach(({ command, args, group, handler, options, description }) => {
            commandsTable.push([command, args, description]);
        });
        shell.echo(commandsTable.toString());
        shell.exit(0);
    }

    const plugin = plugins.find(plugin => plugin.command === argv._[0]);
    if (!plugin) {
        shell.echo(`Error: Plugin not found`);
        shell.exit(1);
    }

    plugin.handler({ command, args, shell, workingDir });
};

init();
