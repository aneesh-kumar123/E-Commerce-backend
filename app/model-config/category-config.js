'use strict';
const { Op } = require('sequelize');
const db = require('../../models');

class CategoryConfig {
  constructor() {
    this.fieldMapping = {
      id: 'id',
      name: 'name',
      description: 'description',
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
      deletedAt: 'deletedAt',
    };

    this.model = db.category;
    this.modelName = db.category.name;
    this.tableName = db.category.options.tableName;

    this.columnMapping = {
      id: this.model.rawAttributes[this.fieldMapping.id].field,
      name: this.model.rawAttributes[this.fieldMapping.name].field,
      description: this.model.rawAttributes[this.fieldMapping.description].field,
      createdAt: this.model.rawAttributes[this.fieldMapping.createdAt].field,
      updatedAt: this.model.rawAttributes[this.fieldMapping.updatedAt].field,
      deletedAt: this.model.rawAttributes[this.fieldMapping.deletedAt].field,
    };

    this.association = {
      product: 'product',  
    };

    this.filters = {
      id: (val) => {
        return {
          [`${this.columnMapping.id}`]: {
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
    };
  }
}

const categoryConfig = new CategoryConfig();

module.exports = categoryConfig;
