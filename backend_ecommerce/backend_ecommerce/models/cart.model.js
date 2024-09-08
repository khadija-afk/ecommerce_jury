export default (connection, DataTypes) => {
    const Cart = connection.define(
        'Cart',
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
            total_amount: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                get() {
                    const value = this.getDataValue('total_amount');
                    return parseFloat(value); // Convertir en nombre lors de la récupération
                }
            },
        },
        { timestamps: true }
    );

    return Cart;
};
