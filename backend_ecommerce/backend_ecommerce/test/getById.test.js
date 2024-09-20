import request from 'supertest';

import  '../databaseTest.js';

describe('GET /api/article/:id', () => {
    let app;
    
    
    
    
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
