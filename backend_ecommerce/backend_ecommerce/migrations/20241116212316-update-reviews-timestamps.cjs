'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('reviews', 'createdAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });

    await queryInterface.changeColumn('reviews', 'updatedAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('reviews', 'createdAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.changeColumn('reviews', 'updatedAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },
};
