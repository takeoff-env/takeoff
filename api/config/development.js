const baseConfig = require('./_base');

const newConfig = Object.assign({}, baseConfig);

newConfig.registrations.push(
    {
        plugin: './ping'
    },
    {
        plugin: {
            register: './auth',
            options: {
                privateKey: process.env.AUTH_PRIVATE_KEY || 'change-me',
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

module.exports = newConfig;
