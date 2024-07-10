export default (connection, DataTypes) => {
    const Order = connection.define(
        'Order',
        {
            user_fk: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users', // Assurez-vous que le nom du modèle est correct
                    key: 'id'
                }
            },
            order_date: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            },
            status: {
                type: DataTypes.STRING,
                allowNull: false
            },
            shipping_address: {
                type: DataTypes.STRING,
                allowNull: false
            },
            shipping_city: {
                type: DataTypes.STRING,
                allowNull: false
            },
            shipping_postal_code: {
                type: DataTypes.STRING,
                allowNull: false
            },
            shipping_country: {
                type: DataTypes.STRING,
                allowNull: false
            },
            total_amount: {
                type: DataTypes.FLOAT,
                allowNull: false
            },
        }, {
            timestamps: true
        });
    
        return Order;
    };