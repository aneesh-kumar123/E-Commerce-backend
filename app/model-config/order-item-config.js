'use strict';
const { Op } = require('sequelize');
const db = require('../../models');

class OrderItemConfig {
  constructor() {
    this.fieldMapping = {
      id: 'id',
      orderId: 'orderId',
      productId: 'productId',
      quantity: 'quantity',
      priceAtOrder: 'priceAtOrder',
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
      deletedAt: 'deletedAt',
    };

    this.model = db.orderItem;
    this.modelName = db.orderItem.name;
    // console.log("the model name is ",this.modelName);
    // console.log("the table name is",db.orderItem.options.tableName);
    this.tableName = db.orderItem.options.tableName;
    // console.log("the table name is",this.tableName);


    this.columnMapping = {
      id: this.model.rawAttributes[this.fieldMapping.id].field,
      orderId: this.model.rawAttributes[this.fieldMapping.orderId].field,
      productId: this.model.rawAttributes[this.fieldMapping.productId].field,
      quantity: this.model.rawAttributes[this.fieldMapping.quantity].field,
      priceAtOrder: this.model.rawAttributes[this.fieldMapping.priceAtOrder].field,
      createdAt: this.model.rawAttributes[this.fieldMapping.createdAt].field,
      updatedAt: this.model.rawAttributes[this.fieldMapping.updatedAt].field,
      deletedAt: this.model.rawAttributes[this.fieldMapping.deletedAt].field,
    };

    this.association = {
      order: 'order',  // Order item belongs to an order
      product: 'product',  // Order item belongs to a product
    };

    this.filters = {
      orderId: (val) => {
        return {
          [`${this.columnMapping.orderId}`]: {
            [Op.eq]: val,
          },
        };
      },

      productId: (val) => {
        return {
          [`${this.columnMapping.productId}`]: {
            [Op.eq]: val,
          },
        };
      },

      quantity: (val) => {
        return {
          [`${this.columnMapping.quantity}`]: {
            [Op.gte]: val,
          },
        };
      },
    };
  }
}

const orderItemConfig = new OrderItemConfig();

module.exports = orderItemConfig;
