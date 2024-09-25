// testServer.js
import { initializeDatabase, Article, User, Categorie, Cart } from './models/index.js';
import jwt from 'jsonwebtoken';
import { env } from './config.js'; // Assurez-vous d'importer la configuration correcte


const prepareDatabase = async () => {
    try {
        await initializeDatabase();
        // Insérer un utilisateur de test
        const user = await User.create({
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            password: 'password123',
            role: 'user',
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
        await Article.create({
            name: 'Test Article',
            content: 'This is a test article',
            brand: 'Test Brand', // Fournir une marque
            price: 10.99, // Fournir un prix
            stock: 100, // Fournir un stock
            user_fk: user.id, // Utiliser l'ID de l'utilisateur créé
            categorie_fk: category.id, // Utiliser l'ID de la catégorie créée
        });
    } catch (error) {
        console.error('Unable to connect to the database or synchronize:', error);
    }
};



// Fonction pour vider la base de données après les tests
const teardownDatabase = async () => {
    try {
        await Article.destroy({ where: {}, truncate: true });
        await Categorie.destroy({ where: {}, truncate: true });
        await User.destroy({ where: {}, truncate: true });
    } catch (error) {
        console.error('Error during database teardown:', error);
    }
};

const getUserToken = async (user_email) => {
    const user = await User.findOne({ where: { email: user_email } });
    if (user_email == 'token.invalid@example.com') return jwt.sign({ id: 100, email: user_email }, "token.invalid");
    if(!user) return jwt.sign({ id: 100, email: user_email }, env.token);
    return jwt.sign({ id: user.id, email: user.email }, env.token);
};


export {
    prepareDatabase,
    teardownDatabase,
    getUserToken
};