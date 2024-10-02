import request from 'supertest';
import { app } from 'server.js'; // Assurez-vous que le chemin est correct
import { prepareDatabase, teardownDatabase, getUserToken } from 'serverTest.js';

describe('DELETE /api/order/orders/:id', () => {

    let user_john2;
   
    
    beforeAll(async () => {
        await prepareDatabase();
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
            .delete('/api/order/orders/22')
            .set('Cookie', `access_token=${user_john2}`)
        
        expect(response.status).toBe(404);  
    });

    it('200', async () => {
    
        // Effectuer la requête avec un en-tête Authorization
        const response = await request(app)
            .delete('/api/order/orders/1')
            .set('Cookie', `access_token=${user_john2}`)

            expect(response.status).toBe(200);  
            
        
    });

    it('500', async () => {
    
        const { OrderDetails } = require('models/index.js');

        const mockorder = {
            id: 1,
            destroy: jest.fn().mockRejectedValue(new Error('Erreur de réseau'))
        };
    
        OrderDetails.findOne = jest.fn().mockRejectedValue(mockorder);

       
        const response = await request(app)
            .delete('/api/order/orders/1')
            .set('Cookie', `access_token=${user_john2}`)
           
        expect(response.status).toBe(500);  
        
    });
    
})