'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    static associate(models) {
      // An order item belongs to an order (many-to-one relationship)
      OrderItem.belongsTo(models.order, { foreignKey: 'orderId' });

      // An order item belongs to a product (many-to-one relationship)
      OrderItem.belongsTo(models.product, { foreignKey: 'productId' });
    }
  }

  OrderItem.init(
    {
      orderId: {
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
      priceAtOrder: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'orderItem',
      tableName: 'order_items',
      underscored: true,
      paranoid: true,
    }
  );

  return OrderItem;
};
