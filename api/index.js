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

require('dotenv').config();

if (!process.env.NODE_ENV) {
    throw new Error('You must set the NODE_ENV environment variable');
}

const ENV = process.env.NODE_ENV || 'development';
let Config;

try {
    Config = require(`./config/${ENV}.js`);
} catch (e) {
    throw e;
}

const startServer = require('./server');

async function init() {
    let server;
    try {
        server = await startServer(Config, ENV);
        server.start(error => {
            if (error) {
                throw error;
            }
            server.log(['debug', 'startup'], `Server started: ${ENV} - http://${server.info.host}:${server.info.port}`);
        });
    } catch (e) {
        throw e;
    }
}

init();
