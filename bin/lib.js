const fs = require('fs');
const Path = require('path');
const glob = require('glob-promise');

const h = {
    progressbar: require('ascii-progress'),
    table: require('tty-table')
};

module.exports = {
    h,
    getCurrentDirectoryBase: function() {
        return Path.basename(process.cwd());
    },

    directoryExists: function(filePath) {
        try {
            return fs.statSync(filePath).isDirectory();
        } catch (err) {
            return false;
        }
    },
    getPluginsForDir: async (baseDir = `${__dirname}/../plugins`) => {
        // Do all the pre-plugin loading
        const basePluginPath = Path.normalize(baseDir);
        let pluginPaths = [];
        try {
            pluginPaths = await glob('**/*.js', { cwd: basePluginPath });
        } catch (e) {
            throw e;
        }
        return pluginPaths.map(plugin => `${basePluginPath}/${plugin}`);
    },
    createTable: (headers, data, options = {}) => {
        const colWidths = (data || [])
            .map(([command, args, options, description]) => {
                return [command.length, (args | '').length, (options || '').length, (description || '').length];
            })
            .reduce((red, val) => headers.map((h, index) => (val[index] > red[index] ? val[index] : red[index])), [
                20,
                20,
                20,
                20
            ]);

        headers.map((header, index) => (header.width = colWidths[index] + 5));

        var commandsTable = new h.table(headers, data, options);
        return commandsTable;
    },
    extractArguments: argv => {
        const [command, ...args] = argv._;
        const opts = Object.keys(argv)
            .filter(k => k !== '_')
            .map(k => [k, argv[k]])
            .reduce((r, v) => {
                r[v[0]] = v[1];
                return r;
            }, {});
        return { command, args, opts };
    }
};
