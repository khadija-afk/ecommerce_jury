export default (connection, DataTypes) => {
    const OrderItem = connection.define(
        'OrderItem',
        {
            order_fk: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'orders',
                    key: 'id'
                }
            },
            product_fk: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'articles',
                    key: 'id'
                }
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            price: {
                type: DataTypes.FLOAT,
                allowNull: false
            }
        },
        { timestamps: true }
    );

    return OrderItem;
};
