'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('PaymentDetails', 'fk_addr_fk', {
      type: Sequelize.INTEGER,
      references: {
        model: 'addresses', // Table de référence
        key: 'id',
      },
      onDelete: 'SET NULL', // Si l'adresse est supprimée, la référence est mise à NULL
      onUpdate: 'CASCADE', // Si l'adresse est modifiée, la référence est mise à jour
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('PaymentDetails', 'fk_addr_fk');
  },
};
