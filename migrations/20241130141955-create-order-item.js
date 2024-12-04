'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('order_items', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4, // Default UUID generation
      },
      order_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'orders',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      product_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'products', // Ensure there's a 'products' table
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      price_at_order: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('order_items');
  },
};
