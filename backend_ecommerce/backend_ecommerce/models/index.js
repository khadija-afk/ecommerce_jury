import { Sequelize } from 'sequelize';
import userModel from '../models/user.model.js';
import articleModel from './article.model.js';
import categorieModel from './catégories.model.js';
import reviewModel from './review.model.js';
import cartModel from './cart.model.js';
import cartItemModel from './cartItem.model.js';
import orderDetailsModel from './orderDetails.model.js';
import orderItemsModel from './orderItem.model.js';
import paymentDetailsModel from './paymentDetail.model.js'; // Ajout des modèles
import dotenv from 'dotenv';

dotenv.config();

const dbPort = process.env.DB_PORT;
const dbHOST = process.env.DB_HOST;
const MYSQL_DATABASE = process.env.MYSQL_DATABASE;
const DB_USER = process.env.DB_USER;
const MYSQL_ROOT_PASSWORD = process.env.MYSQL_ROOT_PASSWORD;
const DIALECT = process.env.DIALECT;

console.log('DB Port:', dbPort);

const connection = new Sequelize(
  MYSQL_DATABASE, // Nom de la base de données
  DB_USER, // Identifiant MySQL
  MYSQL_ROOT_PASSWORD, // Mot de passe MySQL
  {
    host: dbHOST, // URL de MySQL
    dialect: DIALECT,
    port: dbPort,
  }
);

try {
  await connection.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

// Importation des modèles
userModel(connection, Sequelize);
articleModel(connection, Sequelize);
categorieModel(connection, Sequelize);
reviewModel(connection, Sequelize);
cartModel(connection, Sequelize);
cartItemModel(connection, Sequelize);
orderDetailsModel(connection, Sequelize); // Import du modèle OrderDetails
orderItemsModel(connection, Sequelize); // Import du modèle OrderItems
paymentDetailsModel(connection, Sequelize); // Import du modèle PaymentDetails

const {
  User,
  Article,
  Categorie,
  Review,
  Cart,
  CartItem,
  OrderDetails, // Nouveau modèle
  OrderItems, // Nouveau modèle
  PaymentDetails, // Nouveau modèle
} = connection.models;

// Définir les relations User-Article
User.hasMany(Article, { foreignKey: 'user_fk' });
Article.belongsTo(User, { foreignKey: 'user_fk' });

// Définir les relations Categorie-Article
Categorie.hasMany(Article, { foreignKey: 'categorie_fk' });
Article.belongsTo(Categorie, { foreignKey: 'categorie_fk' });

// Définir les relations User-Review
User.hasMany(Review, { foreignKey: 'user_fk' });
Review.belongsTo(User, { foreignKey: 'user_fk' });

// Définir les relations Article-Review
Article.hasMany(Review, { foreignKey: 'product_fk' });
Review.belongsTo(Article, { foreignKey: 'product_fk' });

// Définir les relations User-Cart
User.hasOne(Cart, { foreignKey: 'user_fk' });
Cart.belongsTo(User, { foreignKey: 'user_fk' });

// Cart -> CartItem association
Cart.hasMany(CartItem, { foreignKey: 'cart_fk', as: 'cartItems' });
CartItem.belongsTo(Cart, { foreignKey: 'cart_fk', as: 'Carts' });

// Article -> CartItem association
Article.hasMany(CartItem, { foreignKey: 'product_fk', as: 'cartItems' });
CartItem.belongsTo(Article, { foreignKey: 'product_fk', as: 'article' });

// Définir les relations OrderDetails et User
OrderDetails.belongsTo(User, { foreignKey: 'user_fk' });
User.hasMany(OrderDetails, { foreignKey: 'user_fk' });

// Définir les relations OrderDetails et PaymentDetails
OrderDetails.hasOne(PaymentDetails, { foreignKey: 'order_fk' });
PaymentDetails.belongsTo(OrderDetails, { foreignKey: 'order_fk' });



// Relation entre OrderDetails et OrderItems
OrderDetails.hasMany(OrderItems, { foreignKey: 'order_fk' });
OrderItems.belongsTo(OrderDetails, { foreignKey: 'order_fk' });

// Relation entre OrderItems et Article (product_id est l'article acheté)
OrderItems.belongsTo(Article, { foreignKey: 'product_fk' });
Article.hasMany(OrderItems, { foreignKey: 'product_fk' });

const syncModels = async () => {
  try {
    await User.sync();
    await Categorie.sync();
    await Article.sync();
    await Review.sync();
    await Cart.sync();
    await CartItem.sync();
    await OrderDetails.sync({alter: true}); // Synchroniser OrderDetails
    await PaymentDetails.sync({alter: true}); // Synchroniser PaymentDetails
    await OrderItems.sync({alter: true}); // Synchroniser OrderItems
   

    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Unable to synchronize the database:', error);
  }
};

syncModels();

export {
  User,
  Article,
  Categorie,
  Review,
  Cart,
  CartItem,
  OrderDetails, // Exporter le modèle OrderDetails
  OrderItems, // Exporter le modèle OrderItems
  PaymentDetails, // Exporter le modèle PaymentDetails
  syncModels,
  connection,
};
