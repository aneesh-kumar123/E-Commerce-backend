'use strict';
const { Op } = require('sequelize');
const db = require('../../models');

class OrderConfig {
  constructor() {
    this.fieldMapping = {
      id: 'id',
      userId: 'userId',
      orderStatus: 'orderStatus',
      totalAmount: 'totalAmount',
      paymentStatus: 'paymentStatus',
      paymentMethod: 'paymentMethod',
      shippingAddress: 'shippingAddress',
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
      deletedAt: 'deletedAt',
    };

    this.model = db.order;
    this.modelName = db.order.name;
    this.tableName = db.order.options.tableName;

    this.columnMapping = {
      id: this.model.rawAttributes[this.fieldMapping.id].field,
      userId: this.model.rawAttributes[this.fieldMapping.userId].field,
      orderStatus: this.model.rawAttributes[this.fieldMapping.orderStatus].field,
      totalAmount: this.model.rawAttributes[this.fieldMapping.totalAmount].field,
      paymentStatus: this.model.rawAttributes[this.fieldMapping.paymentStatus].field,
      paymentMethod: this.model.rawAttributes[this.fieldMapping.paymentMethod].field,
      shippingAddress: this.model.rawAttributes[this.fieldMapping.shippingAddress].field,
      createdAt: this.model.rawAttributes[this.fieldMapping.createdAt].field,
      updatedAt: this.model.rawAttributes[this.fieldMapping.updatedAt].field,
      deletedAt: this.model.rawAttributes[this.fieldMapping.deletedAt].field,
    };

    this.association = {
      user: 'user',  // Order belongs to a user
      orderItem: 'orderItem',  // Order has many order items
      payment: 'payment',  // Order has a payment
    };

    this.filters = {
      id: (val) => {
        return {
          [`${this.columnMapping.id}`]: {
            [Op.eq]: val,
          },
        };
      },

      userId: (val) => {
        return {
          [`${this.columnMapping.userId}`]: {
            [Op.eq]: val,
          },
        };
      },

      orderStatus: (val) => {
        return {
          [`${this.columnMapping.orderStatus}`]: {
            [Op.like]: `%${val}%`,
          },
        };
      },

      paymentStatus: (val) => {
        return {
          [`${this.columnMapping.paymentStatus}`]: {
            [Op.like]: `%${val}%`,
          },
        };
      },
    };
  }
}

const orderConfig = new OrderConfig();

module.exports = orderConfig;
