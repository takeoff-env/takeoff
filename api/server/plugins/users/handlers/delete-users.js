const Boom = require('boom');

module.exports = server => {
    return async function(req, reply) {
        const { id } = req.params;

        if (id === req.auth.credentials.id) {
            return server.app.catchError(req, reply)(Boom.badRequest('You cannot delete yourself'));
        }

        try {
            const result = await server.app.db.User.destroy({ where: { id } });
            if (!result) {
                return reply(new Error('There has been an error deleting this user'));
            }
            return reply({ success: true, result });
        } catch (e) {
            reply(e);
        }
    };
};
