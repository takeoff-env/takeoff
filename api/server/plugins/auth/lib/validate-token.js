const Boom = require('boom');
const moment = require('moment');

/**
 * Validator method for checking a valid web token, by default we check for a valid ID and that is has not expired
 * @param _request
 * @param decoded
 * @param cb
 * @returns {*}
 */
module.exports = (_request, decoded, cb) => {

  if (!decoded.id) {
    return cb(Boom.unauthorized(), false, decoded);
  }

  if (moment().isAfter(decoded.exp * 1000)) {
    return cb(Boom.unauthorized(), false, decoded);
  }

  return cb(null, true, decoded);
};
