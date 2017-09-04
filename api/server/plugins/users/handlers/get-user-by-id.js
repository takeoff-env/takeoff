const Boom = require('boom');

module.exports = server => {
    return async function(req, reply) {
        const { id } = req.params;
        try {
            const user = await server.app.db.User.findOne({
                where: { id },
                attributes: { exclude: ['password'] }
            });

            return reply(user);
        } catch (e) {
            reply(e);
        }
    };
};
