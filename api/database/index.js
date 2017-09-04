const fs = require('fs');
const util = require('util');

const readDir = util.promisify(fs.readdir);

const path = require('path');
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/config')[env];

const createDatabaseConnection = async function() {
    try {
        let sequelize;

        
        if (config.use_env_variable) {
            sequelize = new Sequelize(process.env[config.use_env_variable], config);
        } else {
            sequelize = new Sequelize(config.database, config.username, config.password, config);
        }

        const directories = await readDir(`${__dirname}/models`);
        if (!Array.isArray(directories) && directories.length > 0) {
            throw new Error(`Unable to read directories in ${__dirname}/models`);
        }

        const db = directories.reduce((db, fileName) => {
            if (fileName.slice(-3) !== '.js') return db;
            const model = sequelize['import'](path.join(`${__dirname}/models/${fileName}`));
            db[model.name] = model;
            return db;
        }, {});

        Object.keys(db).forEach(function(modelName) {
            if (db[modelName].associate) {
                db[modelName].associate(db);
            }
        });
        
        db.sequelize = sequelize;
        db.Sequelize = Sequelize;

        return db;
    } catch (e) {
      throw e;
    }
};

module.exports = createDatabaseConnection;
