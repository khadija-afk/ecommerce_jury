import request from 'supertest';
import { app } from 'server.js'; // Assurez-vous que le chemin est correct
import { prepareDatabase, teardownDatabase, getUserToken } from 'serverTest.js';

describe('PUT /api/order/orders/:id', () => {

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
        const response = await request(app)
            .put('/api/order/orders/22')
            .set('Cookie', `access_token=${user_john2}`)
            .send({
                   
                    total:19.99

            }) // Utilisation du token valide
    
        console.log(response.body);  // Debugging: pour voir ce que la route retourne exactement
        expect(response.status).toBe(404);  // Vérifiez bien le statut
    });

    it('200', async () => {
    
        // Effectuer la requête avec un en-tête Authorization
        const response = await request(app)
            .put('/api/order/orders/1')
            .set('Cookie', `access_token=${user_john2}`)
            .send({
                   total: 19.99,
            })   
        
        expect(response.status).toBe(200);  // Vérifiez bien le statut
    });

    it('500', async () => {
    
        const { OrderDetails } = require('src/models/index.js');

        const mockorder = {
            id: 1,
            update: jest.fn().mockRejectedValue(new Error('Erreur de réseau'))
        };
    
        OrderDetails.findOne = jest.fn().mockResolvedValue(mockorder); // Mock de la fonction

        // Effectuer la requête avec un en-tête Authorization
        const response = await request(app)
            .put('/api/order/orders/1')
            .set('Cookie', `access_token=${user_john2}`)
            .send({
                total: 100.99,

         })  
        expect(response.status).toBe(500);  
    });
    
})