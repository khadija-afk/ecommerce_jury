import { Sequelize } from 'sequelize';
import userModel from '../models/user.model.js';
import articleModel from './article.model.js';
import categorieModel from './catégories.model.js';
import orderModel from './order.model.js';
import orderItemModel from './orderItem.model.js';
import reviewModel from './review.model.js';
import cartModel from './cart.model.js';
import cartItemModel from './cartItem.model.js';
import paymentDetailModel from './paymentDetail.model.js';
import dotenv from 'dotenv'

dotenv.config();
const dbPort = process.env.DB_PORT;
const dbHOST = process.env.DB_HOST;
const MYSQL_DATABASE = process.env.MYSQL_DATABASE
const DB_USER = process.env.DB_USER
const MYSQL_ROOT_PASSWORD = process.env.MYSQL_ROOT_PASSWORD
const DIALECT = process.env.DIALECT
console.log('DB Port:', dbPort);
// Nouvelle connexion à la DB
/*

const connection = new Sequelize({
  
  dialect: 'mariadb',
  autoReconnect:true,
  useSSL:false,
  allowPublicKeyRetrieval:false,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  logging: console.log,
  define: {
    timestamps: false // Désactive les timestamps automatiques si vous n'en avez pas besoin
  }
});*/
const connection = new Sequelize(
  MYSQL_DATABASE, // Nom de la base de donnée
  DB_USER, // identifiant Mysql
  MYSQL_ROOT_PASSWORD, // Mot de passe Mysql
  {
    host: dbHOST, // URL de mySQL
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

userModel(connection, Sequelize);
articleModel(connection, Sequelize);
categorieModel(connection, Sequelize);
orderModel(connection, Sequelize);
orderItemModel(connection, Sequelize);
reviewModel(connection, Sequelize);
cartModel(connection, Sequelize);
cartItemModel(connection, Sequelize);
paymentDetailModel(connection, Sequelize);

const {
  User,
  Article,
  Categorie,
  Order,
  OrderItem,
  Review,
  Cart,
  CartItem,
  PaymentDetail
} = connection.models;

// Définir les relations User Article
User.hasMany(Article, { foreignKey: 'user_fk' });
Article.belongsTo(User, { foreignKey: 'user_fk' });

// Définir les relations Categorie Article
Categorie.hasMany(Article, { foreignKey: 'categorie_fk' });
Article.belongsTo(Categorie, { foreignKey: 'categorie_fk' });

// Définir les relations Order User
User.hasMany(Order, { foreignKey: 'user_fk' });
Order.belongsTo(User, { foreignKey: 'user_fk' });

// Définir les relations supplémentaires si nécessaire


//Définir les relations entre Order et OrderItem
 Order.hasMany(OrderItem, { foreignKey: 'order_fk' });
 OrderItem.belongsTo(Order, { foreignKey: 'order_fk' });

 // Définir les relations Article - OrderItem
Article.hasMany(OrderItem, { foreignKey: 'product_fk' });
OrderItem.belongsTo(Article, { foreignKey: 'product_fk' });

// Définir les relations User - Review
User.hasMany(Review, { foreignKey: 'user_fk' });
Review.belongsTo(User, { foreignKey: 'user_fk' });

// Définir les relations Article - Review
Article.hasMany(Review, { foreignKey: 'product_fk' });
Review.belongsTo(Article, { foreignKey: 'product_fk' });

// Définir les relations User - Cart
User.hasMany(Cart, { foreignKey: 'user_fk' });
Cart.belongsTo(User, { foreignKey: 'user_fk' });

// Définir les relations CartItem-Cart et CartItem-Article
Cart.hasMany(CartItem, { foreignKey: 'cart_fk' });
CartItem.belongsTo(Cart, { foreignKey: 'cart_fk' });

Article.hasMany(CartItem, { foreignKey: 'product_fk' });
CartItem.belongsTo(Article, { foreignKey: 'product_fk' });

const syncModels = async () => {
  try {
    // Synchroniser les modèles séparément
    await User.sync(/*{alter: true}*/);
    await Categorie.sync();
    await Article.sync({alter: true});
    await Order.sync();
    await OrderItem.sync();
    await Review.sync();
    await Cart.sync();
    await CartItem.sync();
    await PaymentDetail.sync();

    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Unable to synchronize the database:', error);
  }
};

/*const closeConnection = async () => {
  try {
    await sequelize.close();
    console.log('Database connection closed.');
  } catch (error) {
    console.error('Error closing the database connection:', error);
  }
};*/

syncModels();



export {
  User,
  Article,
  Categorie,
  Order,
  OrderItem,
  Review,
  Cart,
  CartItem,
  PaymentDetail,
  syncModels,
  connection
 
};


