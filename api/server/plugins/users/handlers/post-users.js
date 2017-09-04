const { hashPassword } = require('../utils');

module.exports = server => {
    return async function(req, reply) {
        const { username, password, role, displayName } = req.payload;

        try {
            const hashedPassword = await hashPassword(password);
            const userObject = {
                role,
                username,
                password: hashedPassword,
                displayName: displayName
            };

            const data = await server.app.db.User.create(userObject);
            return reply({ success: true, data });
        } catch (e) {
            reply(e);
        }
    };
};
