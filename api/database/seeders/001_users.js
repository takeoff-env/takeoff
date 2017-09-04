const moment = require('moment');

module.exports = {
    up: function(queryInterface, Sequelize) {

        return queryInterface.bulkInsert('Users', [
            {
                id: Sequelize.Utils.toDefaultValue(Sequelize.UUIDV4()),
                username: 'admin',
                password: '$2a$10$C3eXG5ruD3M.WEspUYkE4OcxKmG0qq4MoyShyNkLb3BOVTXSFkDt2',
                display_name: 'Super Admin',
                role: 'admin',
                createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
                updatedAt: moment().format('YYYY-MM-DD HH:mm:ss')
            }
        ]);
    },

    down: function(queryInterface, Sequelize) {
        /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
        return queryInterface.bulkDelete('Users', null, {});
    }
};
