const TABLE_NAME = 'Users';

module.exports = {
    up: function(queryInterface, Sequelize) {
        queryInterface.createTable(TABLE_NAME, {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4
            },

            username: {
                type: Sequelize.STRING,
                field: 'username',
                allowNull: false,
                unique: true
            },

            password: {
                type: Sequelize.STRING,
                field: 'password',
                allowNull: false
            },

            display_name: {
                type: Sequelize.STRING,
                field: 'display_name',
                allowNull: false
            },

            role: {
                type: Sequelize.STRING,
                field: 'role',
                allowNull: false
            },

            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },

            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            },

            deletedAt: {
                allowNull: true,
                type: Sequelize.DATE
            }
        });
    },

    down: function(queryInterface, Sequelize) {
        queryInterface.dropTable(TABLE_NAME);
    }
};
