import request from 'supertest';
import { prepareDatabase, teardownDatabase } from '../serverTest.js';
import { app } from '../server.js';
import jwt from 'jsonwebtoken';
import { env } from '../config.js'; // Assurez-vous d'importer la configuration correcte


describe('DELETE /api/article/:id', () => {
    
    beforeAll(async () => {
        await prepareDatabase();

    });
    
    afterAll(async () => {
        await teardownDatabase();
    });

    afterEach(() => {
        jest.restoreAllMocks(); // Restaurer les mocks après chaque test
    });


    it('deleteById - 404', async () => {

        let userToken;
        if (!process.env.SECRET_KEY) {
            process.env.SECRET_KEY = 'your_secret_key_here';
        }
        userToken = jwt.sign({ id: 1, email: 'john.doe@example.com' }, process.env.SECRET_KEY, { expiresIn: '1h' };     // Signer le token avec une clé secrète


        const response = await request(app)
            .delete('/api/article/999')
            .set('Cookie', `access_token=${userToken}`);
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: 'Article non trouvé' });
    });

    it('deleteById - 403', async () => {

        let userToken;
        userToken = jwt.sign({ id: 999, email: 'john.doe@example.com' }, env.token); // Signer le token avec une clé secrète

        const response = await request(app)
            .delete('/api/article/1')
            .set('Cookie', `access_token=${userToken}`);
        expect(response.status).toBe(403);
        expect(response.body).toEqual({ error: "Seul le créateur peut supprimer !" })
    });


    it('deleteById - 200', async () => {

        let userToken;
        userToken = jwt.sign({ id: 1, email: 'john.doe@example.com' }, env.token); // Signer le token avec une clé secrète


        const response = await request(app)
            .delete('/api/article/1')
            .set('Cookie', `access_token=${userToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toBe('Article deleted !');
    });


    it('deleteById - 404', async () => {
        const response = await request(app).get('/api/article/999');
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: 'Article non trouvé' });
    });

    

});


describe('GET /api/article/:id', () => {
    let userToken;
    
    beforeAll(async () => {
        await prepareDatabase();

        // Générer un token JWT valide pour l'utilisateur de test
        userToken = jwt.sign(
            { id: 1, email: 'john.doe@example.com' }, // Payload du token (l'utilisateur)
            process.env.SECRET_KEY, // Clé secrète utilisée pour signer le token
            { expiresIn: '1h' } // Le token expire après 1 heure
        );

    });
    
    afterAll(async () => {
        await teardownDatabase();
    });

    afterEach(() => {
        jest.fn().mockRestore();
    });

    it('getById - 200', async () => {
        const response = await request(app)
                                .get('/api/article/1')
                                .set('Authorization', `Bearer ${userToken}`);
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

    it('getById - 404', async () => {
        const response = await request(app)
                .get('/api/article/999')
                .set('Authorization', `Bearer ${userToken}`);
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: 'Article non trouvé' });
    });

    it('getById - 500', async () => {
        const { Article } = require('../models/index.js');
    
        // Utiliser jest.spyOn pour intercepter l'appel à findByPk et simuler une erreur
        Article.findByPk = jest.fn().mockRejectedValue(new Error('Erreur de Réseau'))
    
        const response = await request(app).get('/api/article/1');
        
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'Error lors de la récupération' });

        Article.findByPk.mockRestore?.();
    });



    
});


describe('GET /api/article/', () => {
    
    beforeAll(async () => {
        await prepareDatabase();
    });
    
    afterAll(async () => {
        await teardownDatabase();
    });

    afterEach(() => {
        jest.fn().mockRestore();
    });

    it('findAll - 200', async () => {

        const response = await request(app).get('/api/article');
        
        expect(response.status).toBe(200);
        expect(response.body).toEqual([{
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
        }]);

    }); 

    it('findAll - 500', async () => {
        const { Article } = require('../models/index.js');
    
        // Utiliser jest.spyOn pour intercepter l'appel à findByPk et simuler une erreur
        Article.findAll = jest.fn().mockRejectedValue(new Error('Erreur de Réseau'))
    
        const response = await request(app).get('/api/article/');
        
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'Error lors de la récupération' });
        
        Article.findAll.mockRestore?.();
    });

    
});
