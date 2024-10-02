import request from 'supertest';
import { app } from 'server.js'; // Assurez-vous que le chemin est correct
import { prepareDatabase, teardownDatabase, getUserToken } from 'serverTest.js';

describe('GET /api/cart', () => {

    let user_john;
    let user_John2;
    let fake_user;
    
    beforeAll(async () => {
        await prepareDatabase();
        user_john = await getUserToken('john.doe@example.com');
        user_John2 = await getUserToken('john2.doe2@example.com');
        fake_user = await getUserToken('fake@example.com');
    });

    afterAll(async () => {
        await teardownDatabase();
    });

    afterEach(() => {
        jest.restoreAllMocks(); // Restaurer les mocks après chaque test
    });

    it('200', async () => {
    
        // Effectuer la requête avec un en-tête Authorization
        const response = await request(app)
            .get('/api/cart/cart')
            .set('Cookie', `access_token=${user_john}`);  // Utilisation de l'en-tête Authorization
        
        expect(response.status).toBe(200);  // Vérifiez bien le statut
    });

    it('404', async () => {
    
        // Effectuer la requête avec un en-tête Authorization
        const response = await request(app)
            .get('/api/cart/cart')
            .set('Cookie', `access_token=${user_John2}`);  // Utilisation de l'en-tête Authorization
        
        expect(response.status).toBe(404);  // Vérifiez bien le statut
    });

    it('500', async () => {
    
        const { Cart } = require('models/index.js');
    
        Cart.findOne = jest.fn().mockRejectedValue(new Error('Erreur de suppression'))

        // Effectuer la requête avec un en-tête Authorization
        const response = await request(app)
            .get('/api/cart/cart')
            .set('Cookie', `access_token=${user_John2}`);  // Utilisation de l'en-tête Authorization
        
        expect(response.status).toBe(500);  // Vérifiez bien le statut
    });
    
})