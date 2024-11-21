'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('addresses', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            user_fk: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users', // Assurez-vous que la table "Users" existe
                    key: 'id',
                },
                onDelete: 'CASCADE', // Supprime les adresses liées lorsque l'utilisateur est supprimé
                onUpdate: 'CASCADE', // Met à jour les adresses si l'utilisateur est modifié
            },
            address_line1: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            address_line2: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            city: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            state: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            postal_code: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            country: {
                type: Sequelize.STRING,
                defaultValue: 'France',
                allowNull: false,
            },
            phone: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            type: {
                type: Sequelize.ENUM('livraison', 'facturation'),
                defaultValue: 'livraison',
                allowNull: false,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('addresses');
    },
};
