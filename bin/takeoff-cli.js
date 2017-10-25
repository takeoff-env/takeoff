#!/usr/bin/env node

const argv = require('minimist')(process.argv.slice(2));
const glob = require('glob-promise');
const Path = require('path');
const shell = require('shelljs');
const ProgressBar = require('ascii-progress');
const Table = require('tty-table');

// instantiate

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

    pluginPaths.forEach(pluginPath => {
        try {
            const plugin = require(pluginPath);
            plugins.push(plugin);
        } catch (e) {
            shell.echo(`Unable to load plugin ${pluginPath}`);
        }
    });

    shell.echo(`Takeoff v${pkg.version}`);

    const [command, ...args] = argv._;
    const opts = Object.keys(argv).filter(k => k !== '_').map(k => ([k, argv[k]])).reduce((r, v) => {
        r[v[0]] = v[1];
        return r;
    }, {});

    const tableValues = [];

    if (!command || command === 'help') {
        plugins.forEach(({ command, args, group, handler, options, description }) => {
            tableValues.push([command, args, (options || []).map(o => o.option).join('\n'), description]);
        });

        const colWidths = (tableValues || [])
            .map(([command, args, options, description]) => {
                return [command.length, (args | '').length, (options || '').length, (description || '').length];
            })
            .reduce(
                (red, val) => [
                    val[0] > red[0] ? val[0] : red[0],
                    val[1] > red[1] ? val[1] : red[1],
                    val[2] > red[2] ? val[2] : red[2],
                    val[3] > red[3] ? val[3] : red[3]
                ],
                [0, 0, 0, 0]
            );

        var commandsTable = new Table(
            [
                {
                    value: 'Command',
                    width: colWidths[0] + 5,
                    align: 'left'
                },
                {
                    value: 'Arguments',
                    width: colWidths[1] + 5,
                    align: 'left'
                },
                {
                    value: 'Options',
                    width: colWidths[2] + 5,
                    align: 'left'
                },
                {
                    value: 'Description',
                    width: colWidths[3] + 5,
                    align: 'left'
                }
            ],
            tableValues,
            { borderStyle: 0, compact: true, align: 'left', headerAlign: 'left' }
        );
        shell.echo(commandsTable.render());
        shell.exit(0);
    }

    const plugin = plugins.find(plugin => plugin.command === argv._[0]);
    if (!plugin) {
        shell.echo(`Error: Plugin not found`);
        shell.exit(1);
    }

    plugin.handler({ command, args, opts, shell, workingDir, ProgressBar });
};

init();
