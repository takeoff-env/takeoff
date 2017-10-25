#!/usr/bin/env node

const glob = require('glob-promise');
const Path = require('path');
var Table = require('tty-table');

const getEnvPackages = async baseDir => {
    // Do all the pre-plugin loading
    const basePath = `${Path.normalize(baseDir)}/envs`;
    let envs = [];
    try {
        envs = await glob('**/package.json', { cwd: basePath, ignore: ['**/node_modules/**'] });
    } catch (e) {
        throw e;
    }
    return envs.sort((a, b) => {
        if (a.length < b.length) {
            return -1;
        }
        if (a.length > b.length) {
            return 1;
        }
        return 0;
    });
};

module.exports = {
    command: 'list',
    description: 'List all the available environments',
    args: '',
    options: [],
    group: 'takeoff',
    handler: async ({ command, shell, args, workingDir }) => {
        const packagePaths = await getEnvPackages(workingDir);
        const tableValues = [];
        const environments = [];
        const apps = {};

        packagePaths.forEach(pkg => {
            let envName, app, a, b;
            let split;
            if (pkg.match('/env/')) {
                split = pkg.split('/');
                [envName, a, app, b] = split;
                apps[envName] = apps[envName] || [];
                apps[envName].push(app);
            } else {
                try {
                    split = pkg.split('/');
                    [envName] = split;
                    const pkgJson = require(`${workingDir}/envs/${pkg}`);
                    const { version } = pkgJson;
                    environments.push({ envName, version });
                    apps[envName] = apps[envName] || [];
                } catch (e) {}
            }
        });

        environments.forEach(env => {
            tableValues.push([env.envName, env.version, (apps[env.envName] || []).join(', ')]);
        });

        const colWidths = (tableValues || [])
            .map(([name, verion, apps]) => {
                return [(name || '').length, (verion || '').length, (apps | '').length];
            })
            .reduce(
                (red, val) => [
                    val[0] > red[0] ? val[0] : red[0],
                    val[1] > red[1] ? val[1] : red[1],
                    val[2] > red[2] ? val[2] : red[2]
                ],
                ['Environment'.length, 'Version'.length, 'Apps'.length]
            );

        var commandsTable = new Table(
            [
                {
                    value: 'Environment',
                    width: colWidths[0] + 5,
                    align: 'left'
                },
                {
                    value: 'Version',
                    width: colWidths[2] + 5,
                    align: 'left'
                },
                {
                    value: 'Apps',
                    width: colWidths[1] + 5,
                    align: 'left'
                }
            ],
            tableValues,
            { borderStyle: 0, compact: true, align: 'left', headerAlign: 'left' }
        );
        shell.echo(commandsTable.render());
        shell.exit(0);
    }
};
