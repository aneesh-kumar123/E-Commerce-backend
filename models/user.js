'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    // Associations can be defined here
    static associate(models) {
      // A User has many orders (or any other relationships)
      User.hasMany(models.order);
      User.hasOne(models.cart);
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dateOfBirth: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      profileImage: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'user',
      tableName: 'users',
      underscored: true, // Ensure the field names are snake_case
      paranoid: true, // Soft delete enabled
    }
  );

  return User;
};
