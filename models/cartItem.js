'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CartItem extends Model {
    static associate(models) {
      
      CartItem.belongsTo(models.cart, { foreignKey: 'cartId' });

    
      CartItem.belongsTo(models.product, { foreignKey: 'productId' });
    }
  }

  CartItem.init(
    {
      cartId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      productId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'cartItem',
      tableName: 'cart_items',
      underscored: true,
      paranoid: true,
    }
  );

  return CartItem;
};
