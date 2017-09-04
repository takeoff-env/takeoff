const { hashPassword } = require('../utils');

module.exports = server => {

  return function (req, reply) {

    const fields = Object.keys(req.payload);
    let entityPromise;

    if (fields.some(f => f === 'password')) {

      entityPromise = hashPassword(req.payload.password)
        .then(
          password => Object.assign({}, req.payload, { password: password })
        )
        .catch(
          error => server.app.catchError(req, reply)(error)
        );
    } else {
      entityPromise = Promise.resolve(
        Object.assign({}, req.payload)
      );
    }

    return entityPromise
      .then(entity => {
        return server.app.db.User.update(entity, {
          where: {
            id: req.params.id
          },
          fields: fields
        });
      })
      .then(
        () => reply({ success: true })
      )
      .catch(
        error => server.app.catchError(req, reply)(error)
      );
  };
};