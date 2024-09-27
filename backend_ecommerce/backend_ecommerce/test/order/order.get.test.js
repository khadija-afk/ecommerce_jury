import request from 'supertest';
import { app } from '../../server.js'; // Assurez-vous que le chemin est correct
import { prepareDatabase, teardownDatabase, getUserToken } from '../../serverTest.js';

describe('GET /api/order/orders', () => {

    let user_john;
    let user_john2;
   
    
    beforeAll(async () => {
        await prepareDatabase();
        user_john = await getUserToken('john.doe@example.com');
        user_john2 = await getUserToken('john2.doe2@example.com');
        
    });

    afterAll(async () => {
        await teardownDatabase();
    });

    afterEach(() => {
        jest.restoreAllMocks(); // Restaurer les mocks après chaque test
    });

    it('404', async () => {
    
        // Effectuer la requête avec un en-tête Authorization
        const response = await request(app)
            .get('/api/order/orders')
            .set('Cookie', `access_token=${user_john}`);  // Utilisation de l'en-tête Authorization
        
        expect(response.status).toBe(404);  // Vérifiez bien le statut
    });

    it('200', async () => {
        const response = await request(app)
            .get('/api/order/orders')
            .set('Cookie', `access_token=${user_john2}`);  // Utilisation du token valide
    
        console.log(response.body);  // Debugging: pour voir ce que la route retourne exactement
        expect(response.status).toBe(200);  // Vérifiez bien le statut
        expect(response.body).toEqual(
            [
                expect.objectContaining({
                    total: 100,
                    address: "11 rue du bois joly",
                    paymentMethod: "stripe"
                })
            ]
        );
    });

    it('500', async () => {
    
        const { OrderDetails } = require('../../models/index.js');
    
        OrderDetails.findAll = jest.fn().mockRejectedValue(new Error('Erreur serveur lors de la récupération des commandes'))

        // Effectuer la requête avec un en-tête Authorization
        const response = await request(app)
            .get('/api/order/orders')
            .set('Cookie', `access_token=${user_john}`);  // Utilisation de l'en-tête Authorization
        
        expect(response.status).toBe(500);  // Vérifiez bien le statut
    });
    
})