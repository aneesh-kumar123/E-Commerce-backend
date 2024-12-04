'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4, // Default UUID generation
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true, // Username should be unique
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true, // Ensure unique email addresses
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      full_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      date_of_birth: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      profile_image: {
        type: Sequelize.STRING,
        allowNull: true, 
      },
      address: {
        type: Sequelize.STRING,
        allowNull: true, 
      },
      city: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      is_admin: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false, 
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
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE, 
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  },
};
