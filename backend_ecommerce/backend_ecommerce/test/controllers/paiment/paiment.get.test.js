import request from 'supertest';
import { app } from 'server.js'; // Assurez-vous que le chemin est correct
import { prepareDatabase, teardownDatabase, getUserToken,  } from 'serverTest.js';
import { PaymentDetails } from 'src/models/index.js';



describe('GET /api/payment/payment-details', () => {

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

    it('200', async () => {
        const response = await request(app)
            .get('/api/payment/payment-details')
            .set('Cookie', `access_token=${user_john2}`);
        expect(response.status).toBe(200);  
       
    });

   

    it('500', async () => {
    
        const mockFindAll = jest.spyOn(PaymentDetails, 'findAll').mockRejectedValueOnce(new Error('Erreur de Réseau'));

        const response = await request(app)
            .get('/api/payment/payment-details')
            .set('Cookie', `access_token=${user_john2}`);

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: "Erreur serveur lors de la récupération des détails de paiement" });

        mockFindAll.mockRestore();
    });
    
})