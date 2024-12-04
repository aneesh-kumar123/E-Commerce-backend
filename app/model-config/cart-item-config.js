'use strict';
const { Op } = require('sequelize');
const db = require('../../models');

class CartItemConfig {
  constructor() {
    this.fieldMapping = {
      id: 'id',
      cartId: 'cartId',
      productId: 'productId',
      quantity: 'quantity',
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
      deletedAt: 'deletedAt',
    };

    this.model = db.cartItem;
    this.modelName = db.cartItem.name;
    this.tableName = db.cartItem.options.tableName;

    this.columnMapping = {
      id: this.model.rawAttributes[this.fieldMapping.id].field,
      cartId: this.model.rawAttributes[this.fieldMapping.cartId].field,
      productId: this.model.rawAttributes[this.fieldMapping.productId].field,
      quantity: this.model.rawAttributes[this.fieldMapping.quantity].field,
      createdAt: this.model.rawAttributes[this.fieldMapping.createdAt].field,
      updatedAt: this.model.rawAttributes[this.fieldMapping.updatedAt].field,
      deletedAt: this.model.rawAttributes[this.fieldMapping.deletedAt].field,
    };

    this.association = {
      product: 'product',  // Cart item belongs to a product
    };

    this.filters = {
      cartId: (val) => {
        return {
          [`${this.columnMapping.cartId}`]: {
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

const cartItemConfig = new CartItemConfig();

module.exports = cartItemConfig;
