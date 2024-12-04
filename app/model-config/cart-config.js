'use strict';
const { Op } = require('sequelize');
const db = require('../../models');

class CartConfig {
  constructor() {
    this.fieldMapping = {
      id: 'id',
      userId: 'userId',
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
      deletedAt: 'deletedAt',
    };

    this.model = db.cart;
    this.modelName = db.cart.name;
    this.tableName = db.cart.options.tableName;

    this.columnMapping = {
      id: this.model.rawAttributes[this.fieldMapping.id].field,
      userId: this.model.rawAttributes[this.fieldMapping.userId].field,
      createdAt: this.model.rawAttributes[this.fieldMapping.createdAt].field,
      updatedAt: this.model.rawAttributes[this.fieldMapping.updatedAt].field,
      deletedAt: this.model.rawAttributes[this.fieldMapping.deletedAt].field,
    };

    this.association = {
      cartItem: 'cartItem',  
      user: 'user',  
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
    };
  }
}

const cartConfig = new CartConfig();

module.exports = cartConfig;
