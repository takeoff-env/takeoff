# Takeoff: Working with the database

[Home](../../README.md) | [API](../README.md)

## Sequelize

Internally, the Api uses [Sequelize](http://docs.sequelizejs.com/) as it's database layer.  By default Takeoff ships with Postgres as it's database, but in reality any database type can be used and the adapter changed.

## Sequelize CLI

You can use the [Sequelize CLI](https://github.com/sequelize/cli) in the `api` folder to generate models, migrations and seeds.

## Creating a new model by hand

If you want more fine-grained control over your database, you can easily create a migration and model.

In `api/database/migrations` you have a list of sequentially increasing file names.  The first 3 numbers refer to the order (from 001 to 999) and then any name you like.

A simple migration would look like this:

```js
const TABLE_NAME = 'MyItems';

module.exports = {
    up: function(queryInterface, Sequelize) {
        queryInterface.createTable(TABLE_NAME, {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4
            },
            title: {
                type: Sequelize.STRING,
                field: 'title',
                allowNull: false,
                defaultValue: '',
                unique: true
            },
            description: {
                type: Sequelize.STRING,
                field: 'description',
                allowNull: true
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
```

When migrations are run after `npm run up:dev` or `npm run db:reset`, your file will be included and generate a table.  Next want to add the model so it is accessible from our app.

```js
module.exports = (sequelize, DataTypes) => {

  return sequelize.define('MyItems', {

    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },

     title: {
        type: DataTypes.STRING,
        field: 'title',
        allowNull: false,
        defaultValue: '',
        unique: true
    },
    description: {
        type: DataTypes.STRING,
        field: 'description',
        allowNull: true
    },
  });
};
```

The structure of the model and migration and very similar, just be aware of the difference in types.  Models are auto loaded and available on the `server.app.db` object in all plugins.  For example with our `MyItems` model, you would get methods such as `server.app.db.MyItems.create()`
