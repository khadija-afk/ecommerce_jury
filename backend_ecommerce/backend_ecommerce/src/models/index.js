import { Sequelize } from "sequelize";
import userModel from "./user.model.js";
import articleModel from "./article.model.js";
import categorieModel from "./catégories.model.js";
import reviewModel from "./review.model.js";
import cartModel from "./cart.model.js";
import cartItemModel from "./cartItem.model.js";
import orderDetailsModel from "./orderDetails.model.js";
import orderItemsModel from "./orderItem.model.js";
import paymentDetailsModel from "./paymentDetail.model.js";
import favorieModel from "./favorie.model.js";
import userPreferenceModel from "./userPreference.model.js";
import adresseModel from "./adresse.model.js"
import dotenv from "dotenv";


// import logger from "../../../logger.js";

dotenv.config();
let sequelize;



if (process.env.NODE_ENV === 'test') {
  // Utiliser SQLite en mémoire pour les tests
  sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:' // Base de données en mémoire pour les tests
  });
} else {
  // Détecter la base de données à utiliser
  const dbType = process.env.DB_TYPE || 'mysql'; // Par défaut, utiliser MySQL

  if (dbType === 'mysql') {
      sequelize = new Sequelize(
          process.env.MYSQL_DATABASE,         // Nom de la base de données
          process.env.MYSQL_USER,             // Nom d'utilisateur
          process.env.MYSQL_ROOT_PASSWORD,    // Mot de passe
          {
              host: process.env.DB_HOST || 'mysql', // Hôte de la base de données
              dialect: 'mysql',                     // Utilisation de MySQL
              logging: false                        // Désactiver les logs SQL (peut être activé si nécessaire)
          }
      );
  } else if (dbType === 'postgres') {

      console.log('postgres:', process.env.POSTGRES_DB, process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, process.env.DB_HOST)
      sequelize = new Sequelize(
          process.env.POSTGRES_DB,          // Nom de la base de données
          process.env.POSTGRES_USER,        // Nom d'utilisateur
          process.env.POSTGRES_PASSWORD,    // Mot de passe
          {
              host: process.env.DB_HOST || 'postgres', // Hôte de la base de données
              dialect: 'postgres',                     // Utilisation de PostgreSQL
              logging: false                           // Désactiver les logs SQL (peut être activé si nécessaire)
          }
      );
  } else {
      throw new Error(`Unsupported DB_TYPE: ${dbType}`);
  }
}




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
favorieModel(sequelize, Sequelize);
adresseModel(sequelize, Sequelize)
// Initialisez le modèle UserPreferences
const UserPreferences = userPreferenceModel(sequelize, Sequelize);

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
  Favorite,
  Address
} = sequelize.models;

// Définir les relations ici
User.hasMany(Article, { foreignKey: "user_fk" });
Article.belongsTo(User, { foreignKey: "user_fk" });

Categorie.hasMany(Article, { foreignKey: "categorie_fk" });
Article.belongsTo(Categorie, { foreignKey: "categorie_fk" });

User.hasMany(Review, { foreignKey: "user_fk" });
Review.belongsTo(User, { foreignKey: "user_fk" });

Article.hasMany(Review, { foreignKey: "product_fk" });
Review.belongsTo(Article, { foreignKey: "product_fk" });

User.hasOne(Cart, { foreignKey: "user_fk" });
Cart.belongsTo(User, { foreignKey: "user_fk" });

Cart.hasMany(CartItem, { foreignKey: "cart_fk", as: "cartItems" });
CartItem.belongsTo(Cart, { foreignKey: "cart_fk", as: "Carts" });

Article.hasMany(CartItem, { foreignKey: "product_fk", as: "cartItems" });
CartItem.belongsTo(Article, { foreignKey: "product_fk", as: "article" });

OrderDetails.belongsTo(User, { foreignKey: "user_fk" });
User.hasMany(OrderDetails, { foreignKey: "user_fk" });

OrderDetails.hasOne(PaymentDetails, { foreignKey: "order_fk" });
PaymentDetails.belongsTo(OrderDetails, { foreignKey: "order_fk" });

OrderDetails.hasMany(OrderItems, { foreignKey: "order_fk" });
OrderItems.belongsTo(OrderDetails, { foreignKey: "order_fk" });

OrderItems.belongsTo(Article, { foreignKey: "product_fk" });
Article.hasMany(OrderItems, { foreignKey: "product_fk" });


User.hasMany(Address, { foreignKey: 'user_fk' });
Address.belongsTo(User, { foreignKey: 'user_fk' });

Address.hasMany(PaymentDetails, { foreignKey: 'fk_addr_fk', onDelete: 'SET NULL', onUpdate: 'CASCADE' });
PaymentDetails.belongsTo(Address, { foreignKey: 'fk_addr_fk' });


// Définir les relations pour Favorie
User.hasMany(Favorite, { foreignKey: "user_fk" });
Favorite.belongsTo(User, { foreignKey: "user_fk" });

Article.hasMany(Favorite, { foreignKey: "product_fk" });
Favorite.belongsTo(Article, { foreignKey: "product_fk" });

const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

   // Synchronisez les tables dans le bon ordre
await User.sync({ force: true }); // Crée la table Users
await Article.sync({ force: true }); // Crée la table Articles
await Categorie.sync({ force: true }); // Crée la table Categories
await Review.sync({ force: true }); // Crée la table Reviews (après Users et Articles)
await Cart.sync({ force: true }); // Crée les autres tables...
await CartItem.sync({ force: true });
await OrderDetails.sync({ force: true });
await OrderItems.sync({ force: true });
await PaymentDetails.sync({ force: true });
await Favorite.sync({ force: true });
await Address.sync({ force: true });

    console.log("All models were synchronized successfully.");
  } catch (error) {
    console.error("Unable to connect to the database or synchronize:", error);
  }
};

// initializeDatabase();

// Initialisation du modèle `User`

// Fonction pour synchroniser uniquement le modèle `User`
const syncUserTable = async () => {
  try {
    await User.sync({ alter: true });
    console.log('Table `User` synchronisée avec succès.');
  } catch (error) {
    console.error('Erreur lors de la synchronisation de la table `User` :', error);
  }
};

const syncArticleTable = async () => {
  try {
    await Article.sync({ alter: true });
    console.log('Table `Article` synchronisée avec succès.');
  } catch (error) {
    console.error('Erreur lors de la synchronisation de la table `Article` :', error);
  }
};

const syncCategorieTable = async () => {
  try {
    await Categorie.sync({ alter: true });
    console.log('Table `Categorie` synchronisée avec succès.');
  } catch (error) {
    console.error('Erreur lors de la synchronisation de la table `Categorie` :', error);
  }
};

const syncReviewTable = async () => {
  try {
    await Review.sync({ alter: true });
    console.log('Table `Review` synchronisée avec succès.');
  } catch (error) {
    console.error('Erreur lors de la synchronisation de la table `Review` :', error);
  }
};

const syncCartTable = async () => {
  try {
    await Cart.sync({ alter: true });
    console.log('Table `Cart` synchronisée avec succès.');
  } catch (error) {
    console.error('Erreur lors de la synchronisation de la table `Cart` :', error);
  }
};

const syncCartItemTable = async () => {
  try {
    await CartItem.sync({ alter: true });
    console.log('Table `CartItem` synchronisée avec succès.');
  } catch (error) {
    console.error('Erreur lors de la synchronisation de la table `CartItem` :', error);
  }
};

const syncOrderDetailsTable = async () => {
  try {
    await OrderDetails.sync({ alter: true });
    console.log('Table `OrderDetails` synchronisée avec succès.');
  } catch (error) {
    console.error('Erreur lors de la synchronisation de la table `OrderDetails` :', error);
  }
};

const syncOrderItemsTable = async () => {
  try {
    await OrderItems.sync({ alter: true });
    console.log('Table `OrderItems` synchronisée avec succès.');
  } catch (error) {
    console.error('Erreur lors de la synchronisation de la table `OrderItems` :', error);
  }
};

const syncPaymentDetailsTable = async () => {
  try {
    await PaymentDetails.sync({ alter: true });
    console.log('Table `PaymentDetails` synchronisée avec succès.');
  } catch (error) {
    console.error('Erreur lors de la synchronisation de la table `PaymentDetails` :', error);
  }
};

const syncFavoriteTable = async () => {
  try {
    await Favorite.sync({ alter: true });
    console.log('Table `Favorite` synchronisée avec succès.');
  } catch (error) {
    console.error('Erreur lors de la synchronisation de la table `Favorite` :', error);
  }
};

const syncAddressTable = async () => {
  try {
    await Address.sync({ alter: true });
    console.log('Table `Address` synchronisée avec succès.');
  } catch (error) {
    console.error('Erreur lors de la synchronisation de la table `Address` :', error);
  }
};

const syncUserPreferencesTable = async () => {
  try {
    await UserPreferences.sync({ alter: true });
    console.log('Table `UserPreferences` synchronisée avec succès.');
  } catch (error) {
    console.error('Erreur lors de la synchronisation de la table `UserPreferences` :', error);
  }
};

const synchronizeAllTables = async () => {
  try {
    console.log("Début de la synchronisation des tables...");

    // Synchroniser les tables indépendantes en premier
    await syncUserTable();            // Table indépendante
    await syncCategorieTable();       // Table indépendante

    // Synchroniser les tables dépendantes dans l'ordre
    await syncArticleTable();         // Dépend de User et Categorie
    await syncAddressTable();         // Dépend de User
    await syncReviewTable();          // Dépend de User et Article
    await syncCartTable();            // Dépend de User
    await syncCartItemTable();        // Dépend de Cart et Article
    await syncOrderDetailsTable();    // Dépend de User
    await syncOrderItemsTable();      // Dépend de OrderDetails et Article
    await syncPaymentDetailsTable();  // Dépend de OrderDetails et Address
    await syncFavoriteTable();        // Dépend de User et Article
    await syncUserPreferencesTable(); // Dépend de User

    console.log("Toutes les tables ont été synchronisées avec succès !");
  } catch (error) {
    console.error("Erreur lors de la synchronisation des tables :", error);
  }
};

// Appeler la synchronisation globale
// synchronizeAllTables();




// syncAddressTable();


// Appeler la fonction pour synchroniser la table `User`
// syncUserTable();
// syncOrderTabe();
// syncReview();


export {
  sequelize,
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
  Favorite,
  UserPreferences,
  Address
};