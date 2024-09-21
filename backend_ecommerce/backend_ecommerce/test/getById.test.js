import request from 'supertest';
import { prepareDatabase } from '../serverTest.js';
import { app } from '../server.js';

describe('GET /api/article/:id', () => {
    
    beforeAll(async () => {
        await prepareDatabase();
    });
    
    
    it('200', async () => {
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

    it('404', async () => {
        const response = await request(app).get('/api/article/999');
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: 'Article non trouvé' });
    });
});
