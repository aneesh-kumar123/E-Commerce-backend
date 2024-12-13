'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class product extends Model {
    static associate(models) {
      
      product.belongsTo(models.category, { foreignKey: 'categoryId' });
      product.hasMany(models.orderItem);
      product.hasMany(models.cartItem);
    }
  }

  product.init(
    {
      categoryId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      stockQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,  
      },
    },
    {
      sequelize,
      modelName: 'product',
      tableName: 'products',
      underscored: true,
      paranoid: true,
    }
  );

  return product;
};
