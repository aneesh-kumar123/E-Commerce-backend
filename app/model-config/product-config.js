'use strict';
const { Op } = require('sequelize');
const db = require('../../models');

class ProductConfig {
  constructor() {
    this.fieldMapping = {
      id: 'id',
      categoryId: 'categoryId',
      name: 'name',
      description: 'description',
      price: 'price',
      stockQuantity: 'stockQuantity',
      image: 'image',
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
      deletedAt: 'deletedAt',
    };

    this.model = db.product;
    this.modelName = db.product.name;
    this.tableName = db.product.options.tableName;

    this.columnMapping = {
      id: this.model.rawAttributes[this.fieldMapping.id].field,
      categoryId: this.model.rawAttributes[this.fieldMapping.categoryId].field,
      name: this.model.rawAttributes[this.fieldMapping.name].field,
      description: this.model.rawAttributes[this.fieldMapping.description].field,
      price: this.model.rawAttributes[this.fieldMapping.price].field,
      stockQuantity: this.model.rawAttributes[this.fieldMapping.stockQuantity].field,
      image: this.model.rawAttributes[this.fieldMapping.image].field,
      createdAt: this.model.rawAttributes[this.fieldMapping.createdAt].field,
      updatedAt: this.model.rawAttributes[this.fieldMapping.updatedAt].field,
      deletedAt: this.model.rawAttributes[this.fieldMapping.deletedAt].field,
    };

    this.association = {
      category: 'category',  // Product belongs to Category
      orderItem: 'orderItem',  // Product has many order items
      cartItem: 'cartItem',  // Product has many cart items
    };

    this.filters = {
      id: (val) => {
        return {
          [`${this.columnMapping.id}`]: {
            [Op.eq]: val,
          },
        };
      },

      categoryId: (val) => {
        return {
          [`${this.columnMapping.categoryId}`]: {
            [Op.eq]: val,
          },
        };
      },

      name: (val) => {
        return {
          [`${this.columnMapping.name}`]: {
            [Op.like]: `%${val}%`,
          },
        };
      },

      price: (val) => {
        return {
          [`${this.columnMapping.price}`]: {
            [Op.lte]: val, 
          },
        };
      },

      stockQuantity: (val) => {
        return {
          [`${this.columnMapping.stockQuantity}`]: {
            [Op.gte]: val,
          },
        };
      },
    };
  }
}

const productConfig = new ProductConfig();

module.exports = productConfig;
