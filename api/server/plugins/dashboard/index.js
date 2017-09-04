const registerPlugin = (server, options, next) => {
    server.route({
        method: 'GET',
        path: '/dashboard',
        config: {
            auth: {
                scope: ['admin']
            }
        },
        handler: (req, reply) => {
            reply.view('plugins/dashboard/views/index.html', {
                apiPrefix: server.settings.app.apiPrefix
            });
        }
    });

    return next();
};

registerPlugin.attributes = {
    name: 'ed-dashboard',
    version: '1.0.0',
    dependencies: []
};

module.exports = registerPlugin;
