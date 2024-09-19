import request from 'supertest';
import { initializeDatabase, Article, User, Categorie } from '../models/index.js';
import createTestServer from '../serverTest.js'; // Assurez-vous que ce fichier initialise votre serveur sans démarrer l'écoute sur un port.

describe('GET /api/article/:id', () => {
    let app;
    
    beforeAll(async () => {
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
    });
    
    
    it('devrait retourner l\'article avec l\'ID donné', async () => {
        const response = await request(app).get('/api/article/1');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            id: 1,
            name: 'Test Article', // Mettre à jour de 'title' à 'name'
            content: 'This is a test article',
            brand: 'Test Brand',
            price: 10.99,
            status: false,
            stock: 100,
            user_fk: 1, // ou l'ID correspondant de l'utilisateur
            categorie_fk: 1, // ou l'ID correspondant de la catégorie
            photo: null, // ou la valeur appropriée
            createdAt: expect.any(String), // Ignorer la date exacte en utilisant expect.any
            updatedAt: expect.any(String), // Ignorer la date exacte en utilisant expect.any
        });
    });

    it('devrait retourner une erreur 404 si l\'article n\'est pas trouvé', async () => {
        const response = await request(app).get('/api/article/999');
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: 'Article non trouvé' });
    });
});
