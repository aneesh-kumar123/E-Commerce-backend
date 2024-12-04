'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class category extends Model {
    static associate(models) {
      // A category has many products (one-to-many relationship)
      category.hasMany(models.product, { foreignKey: 'categoryId' });
    }
  }

  category.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'category',
      tableName: 'categories',
      underscored: true,
      paranoid: true,
    }
  );

  return category;
};
