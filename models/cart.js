'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    static associate(models) {
      
      Cart.belongsTo(models.user, { foreignKey: 'userId' });

      
      Cart.hasMany(models.cartItem, { foreignKey: 'cartId' });
    }
  }

  Cart.init(
    {
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'cart',
      tableName: 'carts',
      underscored: true,
      paranoid: true,
    }
  );

  return Cart;
};
