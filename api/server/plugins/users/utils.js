const { genSalt, hash, compare } = require('bcrypt');

/**
 * Method to return a password hash
 * @param password
 * @returns {Promise.<T>}
 */
function hashPassword (password) {
    return new Promise((resolve, reject) => {
        genSalt(10, (error, salt) => {
            if (error) return reject(error);
            hash(password, salt, (error, hashed) => {
                if (error) return reject(error);
                resolve(hashed);
            });
        });
    });
}

function checkPassword(password, hash) {
    return new Promise((resolve, reject) => {
        compare(password, hash, (error, isValid) => {
            if (error) return reject(error);
            return resolve(isValid);
        })
    })
}

module.exports = {
    hashPassword,
    checkPassword
}