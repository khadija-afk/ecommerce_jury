'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Étape 1 : Ajouter une colonne temporaire pour sauvegarder les données
    await queryInterface.addColumn('Articles', 'photo_backup', {
      type: Sequelize.JSON,
      allowNull: true,
    });

    // Étape 2 : Copier les données de `photo` dans la colonne temporaire
    await queryInterface.sequelize.query(`
      UPDATE "Articles" SET photo_backup = encode(photo, 'escape')::json;
    `);

    // Étape 3 : Modifier le type de la colonne `photo`
    await queryInterface.changeColumn('Articles', 'photo', {
      type: Sequelize.JSON,
      allowNull: true,
    });

    // Étape 4 : Restaurer les données dans la colonne `photo`
    await queryInterface.sequelize.query(`
      UPDATE "Articles" SET photo = photo_backup;
    `);

    // Étape 5 : Supprimer la colonne temporaire
    await queryInterface.removeColumn('Articles', 'photo_backup');
  },

  down: async (queryInterface, Sequelize) => {
    // Étape 1 : Ajouter une colonne temporaire pour sauvegarder les données
    await queryInterface.addColumn('Articles', 'photo_backup', {
      type: Sequelize.BLOB('long'),
      allowNull: true,
    });

    // Étape 2 : Copier les données de `photo` dans la colonne temporaire
    await queryInterface.sequelize.query(`
      UPDATE "Articles" SET photo_backup = decode(photo::text, 'escape');
    `);

    // Étape 3 : Modifier le type de la colonne `photo` en `bytea`
    await queryInterface.changeColumn('Articles', 'photo', {
      type: Sequelize.BLOB('long'),
      allowNull: true,
    });

    // Étape 4 : Restaurer les données dans la colonne `photo`
    await queryInterface.sequelize.query(`
      UPDATE "Articles" SET photo = photo_backup;
    `);

    // Étape 5 : Supprimer la colonne temporaire
    await queryInterface.removeColumn('Articles', 'photo_backup');
  },
};
