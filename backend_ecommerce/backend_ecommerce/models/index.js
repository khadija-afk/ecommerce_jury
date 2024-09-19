import { Sequelize } from 'sequelize';
import userModel from './user.model.js';
import articleModel from './article.model.js';
import categorieModel from './catégories.model.js';
import reviewModel from './review.model.js';
import cartModel from './cart.model.js';
import cartItemModel from './cartItem.model.js';
import orderDetailsModel from './orderDetails.model.js';
import orderItemsModel from './orderItem.model.js';
import paymentDetailsModel from './paymentDetail.model.js';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = process.env.NODE_ENV === 'test' 
    ? new Sequelize({
        dialect: 'sqlite',
        storage: ':memory:'
    })
    : new Sequelize(process.env.MYSQL_DATABASE, process.env.DB_USER, process.env.MYSQL_ROOT_PASSWORD, {
        host: process.env.DB_HOST,
        dialect: 'mysql',
    });


// Importer les modèles et les associer à la connexion Sequelize
userModel(sequelize, Sequelize);
articleModel(sequelize, Sequelize);
categorieModel(sequelize, Sequelize);
reviewModel(sequelize, Sequelize);
cartModel(sequelize, Sequelize);
cartItemModel(sequelize, Sequelize);
orderDetailsModel(sequelize, Sequelize);
orderItemsModel(sequelize, Sequelize);
paymentDetailsModel(sequelize, Sequelize);

const {
    User,
    Article,
    Categorie,
    Review,
    Cart,
    CartItem,
    OrderDetails,
    OrderItems,
    PaymentDetails,
} = sequelize.models;

// Définir les relations ici
User.hasMany(Article, { foreignKey: 'user_fk' });
Article.belongsTo(User, { foreignKey: 'user_fk' });

Categorie.hasMany(Article, { foreignKey: 'categorie_fk' });
Article.belongsTo(Categorie, { foreignKey: 'categorie_fk' });

User.hasMany(Review, { foreignKey: 'user_fk' });
Review.belongsTo(User, { foreignKey: 'user_fk' });

Article.hasMany(Review, { foreignKey: 'product_fk' });
Review.belongsTo(Article, { foreignKey: 'product_fk' });

User.hasOne(Cart, { foreignKey: 'user_fk' });
Cart.belongsTo(User, { foreignKey: 'user_fk' });

Cart.hasMany(CartItem, { foreignKey: 'cart_fk', as: 'cartItems' });
CartItem.belongsTo(Cart, { foreignKey: 'cart_fk', as: 'Carts' });

Article.hasMany(CartItem, { foreignKey: 'product_fk', as: 'cartItems' });
CartItem.belongsTo(Article, { foreignKey: 'product_fk', as: 'article' });

OrderDetails.belongsTo(User, { foreignKey: 'user_fk' });
User.hasMany(OrderDetails, { foreignKey: 'user_fk' });

OrderDetails.hasOne(PaymentDetails, { foreignKey: 'order_fk' });
PaymentDetails.belongsTo(OrderDetails, { foreignKey: 'order_fk' });

OrderDetails.hasMany(OrderItems, { foreignKey: 'order_fk' });
OrderItems.belongsTo(OrderDetails, { foreignKey: 'order_fk' });

OrderItems.belongsTo(Article, { foreignKey: 'product_fk' });
Article.hasMany(OrderItems, { foreignKey: 'product_fk' });

const initializeDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        
        await sequelize.sync({ alter: true });
        console.log('All models were synchronized successfully.');
    } catch (error) {
        console.error('Unable to connect to the database or synchronize:', error);
    }
};

export {
    sequelize as connection,
    initializeDatabase,
    User,
    Article,
    Categorie,
    Review,
    Cart,
    CartItem,
    OrderDetails,
    OrderItems,
    PaymentDetails,
};
