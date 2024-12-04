'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('order_items', 'deleted_at', {
      allowNull: true,
      type: Sequelize.DATE,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('order_items', 'deleted_at');
  },
};
