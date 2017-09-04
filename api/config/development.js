const baseConfig = require('./_base');

baseConfig.registrations.push(
    // TODO: Swagger doesn't work correctly under a proxy, look at alternative
    // {
    //     plugin: {
    //         register: 'hapi-swagger',
    //         options: {
    //             debug: true,
    //             basePath: '/api',
    //             swaggerUIPath: '/api/swaggerui/'
    //         }
    //     }
    // },
    {
        plugin: './ping'
    },
    {
        plugin: {
            register: './auth',
            options: {
                privateKey: process.env.PRIVATE_KEY || 'change-me',
                tokenExpiry: 3600,
                maxAge: '1h',
                cookieName: 'auth-cookie',
                algorithm: 'HS256',
                algorithms: ['HS256'],
                userTypes: ['admin', 'user']
            }
        }
    },
    {
        plugin: './users'
    },
    {
        plugin: './dashboard'
    },
);

// Passthrough for now
module.exports = baseConfig;
