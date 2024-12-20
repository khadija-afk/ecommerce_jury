// testServer.js
import { initializeDatabase, Article, User, Categorie, Cart, CartItem, OrderDetails, OrderItems, PaymentDetails, Review } from './src/models/index.js';
import jwt from 'jsonwebtoken';
import { env } from './src/config.js'; // Assurez-vous d'importer la configuration correcte


const prepareDatabase = async () => {
    try {
        await initializeDatabase();
        // Insérer un utilisateur de test
        const user = await User.create({
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            password: 'password123',
            role: 'admin',
        });

        

        const user2 = await User.create({
            firstName: 'John2',
            lastName: 'Doe2',
            email: 'john2.doe2@example.com',
            password: 'password1232',
            role: 'user',
        });

        const user3 = await User.create({
            firstName: 'John3',
            lastName: 'Doe3',
            email: 'John3.Doe3@example.com',
            password: 'password1232',
            role: 'user',
        });

        // Insérer une catégorie de test
        const category = await Categorie.create({
            name: 'Test Category',
            description: 'A category for testing',
        });

        // Insérer une cart de test
        const cart = await Cart.create({
            name: 'cart',
            user_fk: user.id,
            total_amount: 0
        });

        

        // Insérer des données de test avec tous les champs requis
        const article = await Article.create({
            name: 'Test Article',
            content: 'This is a test article',
            brand: 'Test Brand', // Fournir une marque
            price: 10.99, // Fournir un prix
            stock: 100, // Fournir un stock
            user_fk: user.id, // Utiliser l'ID de l'utilisateur créé
            categorie_fk: category.id, // Utiliser l'ID de la catégorie créée
        });

        
        const article2 = await Article.create({
            name: 'Test Article 2',
            content: 'This is a test article 2',
            brand: 'Test Brand 2', // Fournir une marque
            price: 33.99, // Fournir un prix
            stock: 12, // Fournir un stock
            user_fk: user.id, // Utiliser l'ID de l'utilisateur créé
            categorie_fk: category.id, // Utiliser l'ID de la catégorie créée
        });

        const cartItem = await CartItem.create({
            cart_fk: cart.id,
            product_fk: article.id,
            quantity: 10
        })

        const newOrder = await OrderDetails.create({
            user_fk: user.id,
            total: 100,
            status: "en attent"
           
        });
        const newOrder2 = await OrderDetails.create({
            user_fk: user3.id,
            total: 100,
            status: "en attent"
        });

        const orderItem = await OrderItems.create({
            order_fk: newOrder.id,
            product_fk: article.id,
            quantity: 10,
            price: 100.99
        });

        const paiment = await PaymentDetails.create({
            order_fk: newOrder.id,
            amount: 19.99,
            provider: "stripe",
            status: "succes"

        })

        const review = await Review.create({
            user_fk: user.id,
            product_fk: article2.id,
            rating: 4,
            comment: "exellent",
            status: "approved"
        })

    } catch (error) {
        console.error('Unable to connect to the database or synchronize:', error);
    }
};



// Fonction pour vider la base de données après les tests
const teardownDatabase = async () => {
    try {
        // Supprimer les éléments dépendants en premier
        await CartItem.destroy({ where: {}, truncate: true });  // Dépend de Cart et Article
        await OrderDetails.destroy({ where: {}, truncate: true }); 
        await OrderItems.destroy({ where: {}, truncate: true });  // Dépend de User
        await PaymentDetails.destroy({ where: {}, truncate: true });

        await Review.destroy({ where: {}, truncate: true });
        
        // Supprimer les éléments parents ensuite
        await Cart.destroy({ where: {}, truncate: true });  // Dépend de User
        await Article.destroy({ where: {}, truncate: true });  // Dépend de User et Categorie
        await Categorie.destroy({ where: {}, truncate: true });
        await User.destroy({ where: {}, truncate: true });
    } catch (error) {
        console.error('Error during database teardown:', error);
    }
};

const getUserToken = async (user_email) => {
    const user = await User.findOne({
        where: { email: user_email },
        attributes: ['id', 'email', 'role'], // Inclure explicitement le champ "role"
    });

    if (user_email === 'token.invalid@example.com') {
        return jwt.sign({ id: 100, email: user_email }, "token.invalid");
    }

    if (!user) {
        return jwt.sign({ id: 100, email: user_email }, env.token);
    }

    // Inclure le rôle dans le token
    return jwt.sign({ id: user.id, email: user.email, role: user.role }, env.token);
};

export {
    prepareDatabase,
    teardownDatabase,
    getUserToken, 

};