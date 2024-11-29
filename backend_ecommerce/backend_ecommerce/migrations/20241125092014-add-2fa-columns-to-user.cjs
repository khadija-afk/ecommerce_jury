'use strict';

module.exports = {
    up: async (queryInterface, { BOOLEAN, STRING }) => {
        await queryInterface.addColumn('Users', 'is2FAEnabled', {
            type: BOOLEAN,
            defaultValue: false,
        });
        await queryInterface.addColumn('Users', 'twoFASecret', {
            type: STRING,
            allowNull: true,
        });
    },

    down: async (queryInterface) => {
        await queryInterface.removeColumn('Users', 'is2FAEnabled');
        await queryInterface.removeColumn('Users', 'twoFASecret');
    },
};
