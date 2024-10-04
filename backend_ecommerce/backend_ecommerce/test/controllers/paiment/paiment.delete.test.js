import request from 'supertest';
import { app } from 'server.js'; 
import { prepareDatabase, teardownDatabase, getUserToken,  } from 'serverTest.js';

describe('DELETE /api/payment/payment-details/:id', () => {

    let user_john2;

    
    
    beforeAll(async () => {
        await prepareDatabase();
        user_john2 = await getUserToken('john2.doe2@example.com');
    });

    afterAll(async () => {
        await teardownDatabase();
    });

    afterEach(() => {
        jest.restoreAllMocks(); 
    });

    it('404', async () => {
        const response = await request(app)
            .delete('/api/payment/payment-details/33')
            .set('Cookie', `access_token=${user_john2}`)
            
        expect(response.status).toBe(404);  
       
    });

    it('204', async () => {
        const response = await request(app)
            .delete('/api/payment/payment-details/1')
            .set('Cookie', `access_token=${user_john2}`)
        expect(response.status).toBe(204);  
        
       
    });

   
    it('500', async () => {
    
        const { PaymentDetails } = require('models/index.js');

        const mockorder = {
            id: 1,
            destroy: jest.fn().mockRejectedValue(new Error('Erreur de réseau'))
        };
    
        PaymentDetails.findByPk = jest.fn().mockRejectedValue(mockorder);

       
        const response = await request(app)
            .delete('/api/payment/payment-details/1')
            .set('Cookie', `access_token=${user_john2}`)
           
        expect(response.status).toBe(500);  
        
    });
})