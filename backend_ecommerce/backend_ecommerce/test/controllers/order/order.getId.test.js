import request from 'supertest';
import { app } from 'server.js';
import { prepareDatabase, teardownDatabase, getUserToken } from 'serverTest.js';

describe('GET /api/order/orders/:id', () => {
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

    it('404 - Order not found', async () => {
        const response = await request(app)
            .get('/api/order/orders/33')
            .set('Cookie', `access_token=${user_john}`);
        
        expect(response.status).toBe(404);  
    });

    it('200 - Successful order retrieval', async () => {
        const response = await request(app)
            .get('/api/order/orders/1')
            .set('Cookie', `access_token=${user_john}`);
    
        expect(response.status).toBe(200);

        // Vérification partielle pour les champs clés seulement
        expect(response.body).toEqual(
            expect.objectContaining({
                id: 1,
                user_fk: 1,
                total: 100,
                status: "en attent"
                
            })
        );

        // Si vous souhaitez ignorer certaines valeurs, les ajouter pour `createdAt` et `updatedAt`
        expect(response.body.createdAt).toBeDefined();
        expect(response.body.updatedAt).toBeDefined();
    });

    it('500 - Server error simulated during order retrieval', async () => {
        const { OrderDetails } = require('src/models/index.js');
        OrderDetails.findOne = jest.fn().mockRejectedValue(new Error('Erreur serveur lors de la récupération des commandes'));

        const response = await request(app)
            .get('/api/order/orders/1')
            .set('Cookie', `access_token=${user_john2}`);
        
        expect(response.status).toBe(500);
    });
});
