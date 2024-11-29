'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDescription = await queryInterface.describeTable('Users');

    if (!tableDescription.resetPasswordToken) {
      await queryInterface.addColumn('Users', 'resetPasswordToken', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    if (!tableDescription.resetPasswordExpires) {
      await queryInterface.addColumn('Users', 'resetPasswordExpires', {
        type: Sequelize.DATE,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDescription = await queryInterface.describeTable('Users');

    if (tableDescription.resetPasswordToken) {
      await queryInterface.removeColumn('Users', 'resetPasswordToken');
    }

    if (tableDescription.resetPasswordExpires) {
      await queryInterface.removeColumn('Users', 'resetPasswordExpires');
    }
  }
};
