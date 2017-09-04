const Boom = require('boom');
const jwt = require('jsonwebtoken');
const { checkPassword } = require('../../users/utils');

module.exports = (server, options) => {
    return async function(req, reply) {
        const { userType } = req.params;
        const { username, password } = req.payload;
        const { privateKey, algorithm, tokenExpiry, cookieName } = options;

        if (!options.userTypes.includes(userType)) {
            return reply(Boom.badData(`Unknown user type ${userType}`));
        }

        try {
            const user = await server.app.db.User.findOne({ where: { username } });
            if (!user) {
                return reply(Boom.unauthorized('Username or password do not match'));
            }
            const validPassword = await checkPassword(password, user.password);
            if (!validPassword) {
                return reply(Boom.unauthorized('Username or password do not match'));
            }

            const token = jwt.sign({ id: user.id, scope: userType }, privateKey, {
                algorithm,
                expiresIn: tokenExpiry
            });

            return reply({ token }).state(cookieName, token);
        } catch (e) {
            reply(e);
        }
    };
};
