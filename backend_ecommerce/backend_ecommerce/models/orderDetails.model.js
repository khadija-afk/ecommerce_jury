export default (connection, DataTypes) => {
    connection.define(
        'OrderDetails',
        {
            user_fk: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users', // Assurez-vous que le modèle utilisateur est correctement nommé
                    key: 'id'
                }
            },
            total: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false
            },
            payment_fk: {
                type: DataTypes.INTEGER,
                allowNull: true, // Peut être optionnel si le paiement n'est pas encore fait
                references: {
                    model: 'PaymentDetails',
                    key: 'id'
                }
            }
        },
        { timestamps: true }
    );
};
