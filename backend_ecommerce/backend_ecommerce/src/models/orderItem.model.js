export default (connection, DataTypes) => {
    connection.define(
        'OrderItems',
        {
            order_fk: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'OrderDetails',
                    key: 'id'
                }
            },
            product_fk: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Articles',
                    key: 'id'
                }
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1 // Valeur par défaut si la quantité n'est pas spécifiée
            },
            price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false // Le prix au moment de la commande, pour éviter toute modification ultérieure des prix
            }
        },
        { timestamps: true }
    );
};
