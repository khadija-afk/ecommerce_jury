import request from 'supertest';
import { app } from 'server.js'; 
import { prepareDatabase, teardownDatabase, getUserToken,  } from 'serverTest.js';

describe('POST /api/payment/payment-details', () => {

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

    it('400', async () => {
        const response = await request(app)
            .post('/api/payment/payment-details')
            .set('Cookie', `access_token=${user_john2}`)
            .send({
                order_fk: 1,
                amount: 19.99
            })
        expect(response.status).toBe(400);  
       
    });

    it('201', async () => {
        const response = await request(app)
            .post('/api/payment/payment-details')
            .set('Cookie', `access_token=${user_john2}`)
            .send({
                order_fk: 1,
                amount: 19.99, 
                provider: "stripe"
            })
        expect(response.status).toBe(201);  
        
       
    });

   
    it('500', async () => {
    
        const { PaymentDetails } = require('src/models/index.js');
    
        PaymentDetails.create = jest.fn().mockRejectedValue(new Error("Erreur serveur lors de l'ajout du détail de paiement"))

        const response = await request(app)
            .post('/api/payment/payment-details')
            .set('Cookie', `access_token=${user_john2}`)
            .send({
                order_fk: 1,
                amount: 19.99, 
                provider: "stripe"

         })  
        expect(response.status).toBe(500);  
    });
    
})