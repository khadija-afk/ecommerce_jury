export default (connection, DataTypes) => {
    connection.define(
        'PaymentDetails',
        {
            order_fk: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'OrderDetails',
                    key: 'id'
                }
            },
            amount: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false
            },
            provider: {
                type: DataTypes.STRING,
                allowNull: false
            },
            
            status: {
                type: DataTypes.STRING,
                allowNull: false, // Par exemple : 'Paid', 'Pending', 'Failed'
                defaultValue: 'Pending'
            }
        },
        { timestamps: true }
    );
};
