import { initializeDatabase, Article, User, Categorie } from './models/index.js';
import createTestServer from './serverTest.js'; // Assurez-vous que ce fichier initialise votre serveur sans démarrer l'écoute sur un port.


const beforeAll = async () => {
    // Initialiser la base de données en mémoire et synchroniser les modèles
    await initializeDatabase();

    // Créer une instance de l'application de test
    app = createTestServer();
    
    // Insérer un utilisateur de test
    const user = await User.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        role: 'user',
    });

    // Insérer une catégorie de test
    const category = await Categorie.create({
        name: 'Test Category',
        description: 'A category for testing',
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
};

export default beforeAll;