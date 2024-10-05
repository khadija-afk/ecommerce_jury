export default (connection, DataTypes) => {
    connection.define(
        'OrderDetails',
        {
            user_fk: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id'
                },

                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            },
            total: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false
            },
            address: {
                type: DataTypes.STRING,
                allowNull: false,  // L'adresse de livraison est obligatoire
            },
            paymentMethod: {
                type: DataTypes.STRING,
                allowNull: false,  // La méthode de paiement est obligatoire
            }
        },
        { timestamps: true }
    );
};
