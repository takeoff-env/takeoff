const Boom = require('boom');

module.exports = (server, options) => {
    return function(req, reply) {
        const { userType } = req.params;

        if (!options.userTypes.includes(userType)) {
            return reply(Boom.badData(`Unknown user type ${userType}`));
        }

        return reply.view('plugins/auth/templates/login.html', {
            userType,
            apiPrefix: server.settings.app.apiPrefix
        });
    }
}