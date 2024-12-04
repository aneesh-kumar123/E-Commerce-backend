'use strict';
const { Op } = require("sequelize");
const db = require("../../models"); 
const { validateUUID } = require("../utils/uuid"); 

class UserConfig {
  constructor() {
    this.fieldMapping = {
      id: "id",
      username: "username",
      email: "email",
      password: "password",
      firstName: "firstName",
      lastName: "lastName",
      fullName: "fullName",
      dateOfBirth: "dateOfBirth",
      profileImage: "profileImage",
      address: "address",
      city: "city",
      isAdmin: "isAdmin",
      createdAt: "createdAt",
      updatedAt: "updatedAt",
      deletedAt: "deletedAt",
    };

    this.model = db.user; 
    this.modelName = db.user.name;
    this.tableName = db.user.options.tableName; 

    
    this.columnMapping = {
      id: this.model.rawAttributes[this.fieldMapping.id].field,
      username: this.model.rawAttributes[this.fieldMapping.username].field,
      email: this.model.rawAttributes[this.fieldMapping.email].field,
      password: this.model.rawAttributes[this.fieldMapping.password].field,
      firstName: this.model.rawAttributes[this.fieldMapping.firstName].field,
      lastName: this.model.rawAttributes[this.fieldMapping.lastName].field,
      fullName: this.model.rawAttributes[this.fieldMapping.fullName].field,
      dateOfBirth: this.model.rawAttributes[this.fieldMapping.dateOfBirth].field,
      profileImage: this.model.rawAttributes[this.fieldMapping.profileImage].field,
      address: this.model.rawAttributes[this.fieldMapping.address].field,
      city: this.model.rawAttributes[this.fieldMapping.city].field, 
      isAdmin: this.model.rawAttributes[this.fieldMapping.isAdmin].field,
      createdAt: this.model.rawAttributes[this.fieldMapping.createdAt].field,
      updatedAt: this.model.rawAttributes[this.fieldMapping.updatedAt].field,
      deletedAt: this.model.rawAttributes[this.fieldMapping.deletedAt].field,
    };

    
    this.association = {
      // Define associations here, e.g., "user has many orders"
      order: "order", // Uncomment and update if needed
      cart: "cart", // Uncomment and update if needed
    };

 
    this.filters = {
      id: (val) => {
        validateUUID(val); 
        return {
          [`${this.columnMapping.id}`]: {
            [Op.eq]: val,
          },
        };
      },

      username: (val) => {
        return {
          [`${this.columnMapping.username}`]: {
            [Op.like]: `%${val}%`, 
          },
        };
      },

      email: (val) => {
        return {
          [`${this.columnMapping.email}`]: {
            [Op.eq]: val, 
          },
        };
      },

      firstName: (val) => {
        return {
          [`${this.columnMapping.firstName}`]: {
            [Op.like]: `%${val}%`, 
          },
        };
      },

      lastName: (val) => {
        return {
          [`${this.columnMapping.lastName}`]: {
            [Op.like]: `%${val}%`, 
          },
        };
      },

      fullName: (val) => {
        return {
          [`${this.columnMapping.fullName}`]: {
            [Op.like]: `%${val}%`, 
          },
        };
      },

      isAdmin: (val) => {
        return {
          [`${this.columnMapping.isAdmin}`]: {
            [Op.eq]: val === "true", 
          },
        };
      },

      city: (val) => {
        return {
          [`${this.columnMapping.city}`]: {
            [Op.like]: `%${val}%`,
          },
        };
      },
    };
  }
}

const userConfig = new UserConfig();

module.exports = userConfig;
