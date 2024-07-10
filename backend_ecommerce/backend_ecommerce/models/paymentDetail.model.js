export default (connection, DataTypes) => {
    const PaymentDetail = connection.define(
        'PaymentDetail',
        {
            order_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                /*references: {
                    model: 'Order', // Nom du modèle cible
                    key: 'order_id' // Clé dans le modèle cible à laquelle cela se réfère
                }*/
            },
            amount: {
                type: DataTypes.FLOAT,
                allowNull: false
            },
            payment_method: {
                type: DataTypes.STRING,
                allowNull: false
            },
            payment_status: {
                type: DataTypes.STRING,
                allowNull: false
            }
        },
        { timestamps: false }
    );

    return PaymentDetail;
};
