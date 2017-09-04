const registerPlugin = (server, options, next) => {
    server.route({
        method: 'GET',
        path: '/ping',
        config: {
            auth: false
        },
        handler: async function (req, reply) {
            try {
                const dbError = await server.app.db.sequelize.authenticate();
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
