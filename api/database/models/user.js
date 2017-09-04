module.exports = (sequelize, DataTypes) => {

  return sequelize.define('User', {

    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },

    username: {
      type: DataTypes.CHAR,
      field: 'username',
      allowNull: false,
      unique: true
    },

    password: {
      type: DataTypes.STRING,
      field: 'password',
      allowNull: false
    },

    role: {
      type: DataTypes.STRING,
      field: 'role',
      allowNull: false
    },

    displayName: {
      type: DataTypes.CHAR,
      field: 'display_name',
      allowNull: false
    }
  }, {
    paranoid: false,
    force: true
  });
};