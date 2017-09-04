module.exports = server => {
  return async function (req, reply) {

    const {limit, offset} = req.query;

    try {
      const allUsers = await server.app.db.User.findAll({
        limit,
        offset,
        order: [
          ['displayName', 'ASC']
        ],
        attributes: { exclude: ['password'] }
      });

      return reply(allUsers);
    } catch (e) {
      return reply(e);
    }
  };
};