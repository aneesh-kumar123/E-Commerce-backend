'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      
      Order.belongsTo(models.user, { foreignKey: 'userId' });

      // An order has many order items (one-to-many relationship)
      Order.hasMany(models.orderItem, { foreignKey: 'orderId' });
      Order.hasMany(models.payment, { foreignKey: 'orderId' });
    }
  }

  Order.init(
    {
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      orderStatus: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      paymentStatus: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      paymentMethod: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      shippingAddress: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'order',
      tableName: 'orders',
      underscored: true,
      paranoid: true,
    }
  );

  return Order;
};
