import request from 'supertest';
import { app } from '../../../server.js'; // Assurez-vous que le chemin est correct
import { prepareDatabase, teardownDatabase, getUserToken,  } from '../../../serverTest.js';
import { OrderItems } from '../../../models/index.js';



describe('GET /api/orderItem/order-items', () => {

    let user_john3;

    
    
    beforeAll(async () => {
        await prepareDatabase();
        user_john3 = await getUserToken('john3.doe3@example.com');
    });

    afterAll(async () => {
        await teardownDatabase();
    });

    afterEach(() => {
        jest.restoreAllMocks(); // Restaurer les mocks après chaque test
    });

    it('200', async () => {
        const response = await request(app)
            .get('/api/orderItem/order-items')
            .set('Cookie', `access_token=${user_john3}`);
        expect(response.status).toBe(200);  
       
    });

   

    it('500', async () => {
    
        const mockFindAll = jest.spyOn(OrderItems, 'findAll').mockRejectedValueOnce(new Error('Erreur de Réseau'));

        const response = await request(app)
            .get('/api/orderItem/order-items')
            .set('Cookie', `access_token=${user_john3}`);

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: "Erreur serveur lors de la récupération des articles de commande" });

        mockFindAll.mockRestore();
    });
    
})