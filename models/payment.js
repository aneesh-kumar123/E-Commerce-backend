'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class payment extends Model {
    static associate(models) {
      
      payment.belongsTo(models.order, { foreignKey: 'orderId' });
    }
  }

  payment.init(
    {
      orderId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      paymentMethod: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      paymentStatus: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      transactionId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      amountPaid: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'payment',
      tableName: 'payments',
      underscored: true,
      paranoid: true,
    }
  );

  return payment;
};
