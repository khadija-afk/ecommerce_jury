import request from 'supertest';
import { app } from 'server.js'; 
import { prepareDatabase, teardownDatabase, getUserToken,  } from 'serverTest.js';

describe('GET /api/payment/payment-details/:id', () => {

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
            .get('/api/payment/payment-details/33')
            .set('Cookie', `access_token=${user_john2}`);
        expect(response.status).toBe(404);  
       
    });

    it('200', async () => {
        const response = await request(app)
            .get('/api/payment/payment-details/1')
            .set('Cookie', `access_token=${user_john2}`);
        expect(response.status).toBe(200);  
        
       
    });

   
    it('500', async () => {
    
        const { PaymentDetails } = require('src/models/index.js');
    
        PaymentDetails.findOne = jest.fn().mockRejectedValue(new Error('Erreur serveur lors de la récupération du détail de paiement'))

        
        const response = await request(app)
            .get('/api/payment/payment-details/1')
            .set('Cookie', `access_token=${user_john2}`);  
        
        expect(response.status).toBe(500);  
    });
})