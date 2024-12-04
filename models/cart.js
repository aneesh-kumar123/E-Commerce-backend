'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    static associate(models) {
      // A cart belongs to a user (one-to-one relationship)
      Cart.belongsTo(models.user, { foreignKey: 'userId' });

      // A cart has many cart items (one-to-many relationship)
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
