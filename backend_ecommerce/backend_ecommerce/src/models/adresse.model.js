export default (connection, DataTypes) => {
    const Address = connection.define(
        'Address',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            user_fk: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users', // Référence au modèle User
                    key: 'id',
                },
                onDelete: 'CASCADE', // Supprime les adresses liées lorsque l'utilisateur est supprimé
                onUpdate: 'CASCADE', // Met à jour les adresses si l'utilisateur est modifié
            },
            address_line1: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            address_line2: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            city: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            state: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            postal_code: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            country: {
                type: DataTypes.STRING,
                defaultValue: 'France',
                allowNull: false,
            },
            phone: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            type: {
                type: DataTypes.ENUM('livraison', 'facturation'),
                defaultValue: 'livraison',
                allowNull: false,
            },
        },
        {
            timestamps: true, // Ajoute createdAt et updatedAt automatiquement
            tableName: 'addresses', // Nom explicite pour la table dans la base de données
        }
    );

    return Address;
};
