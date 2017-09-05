const registerPlugin = (server, options, next) => {

    const apiServer = server.select('api');

    apiServer.route({
        method: 'GET',
        path: '/ping',
        config: {
            auth: false
        },
        handler: async function (req, reply) {
            try {
                const dbError = await apiServer.app.db.sequelize.authenticate();
                if (!dbError) {
                    return reply(true);
                }
                return reply(dbError);
            } catch (e) {
                reply(e);
            }
        }
    });

    return next();
};

registerPlugin.attributes = {
    name: 'ed-ping-uptime',
    version: '1.0.0',
    dependencies: []
};

module.exports = registerPlugin;
