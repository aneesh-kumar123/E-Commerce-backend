'use strict';
const { Op } = require('sequelize');
const db = require('../../models');

class PaymentConfig {
  constructor() {
    this.fieldMapping = {
      id: 'id',
      orderId: 'orderId',
      paymentMethod: 'paymentMethod',
      paymentStatus: 'paymentStatus',
      transactionId: 'transactionId',
      amountPaid: 'amountPaid',
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    };

    this.model = db.payment;
    this.modelName = db.payment.name;
    this.tableName = db.payment.options.tableName;

    this.columnMapping = {
      id: this.model.rawAttributes[this.fieldMapping.id].field,
      orderId: this.model.rawAttributes[this.fieldMapping.orderId].field,
      paymentMethod: this.model.rawAttributes[this.fieldMapping.paymentMethod].field,
      paymentStatus: this.model.rawAttributes[this.fieldMapping.paymentStatus].field,
      transactionId: this.model.rawAttributes[this.fieldMapping.transactionId].field,
      amountPaid: this.model.rawAttributes[this.fieldMapping.amountPaid].field,
      createdAt: this.model.rawAttributes[this.fieldMapping.createdAt].field,
      updatedAt: this.model.rawAttributes[this.fieldMapping.updatedAt].field,
    };

    this.association = {
      order: 'order',  // Payment belongs to an order
    };

    this.filters = {
      orderId: (val) => {
        return {
          [`${this.columnMapping.orderId}`]: {
            [Op.eq]: val,
          },
        };
      },

      paymentStatus: (val) => {
        return {
          [`${this.columnMapping.paymentStatus}`]: {
            [Op.eq]: val,
          },
        };
      },

      paymentMethod: (val) => {
        return {
          [`${this.columnMapping.paymentMethod}`]: {
            [Op.like]: `%${val}%`,
          },
        };
      },
    };
  }
}

const paymentConfig = new PaymentConfig();

module.exports = paymentConfig;
