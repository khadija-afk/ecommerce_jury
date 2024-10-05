import request from 'supertest';
import { prepareDatabase, teardownDatabase, getUserToken } from 'serverTest.js';
import { app } from 'server.js';
import { OrderItems } from 'src/models/index.js';

describe('POST /api/orderItem/order-items', () => {
    
    let user_John2;
    let user_John;
   

    beforeAll(async () => {
        await prepareDatabase();
        user_John = await getUserToken('john.doe@example.com');
        user_John2 = await getUserToken('john2.doe2@example.com');

    });
    
    afterAll(async () => {
        await teardownDatabase();
    });

    afterEach(() => {
        jest.restoreAllMocks(); // Restaurer les mocks après chaque test
    });

    it('400 ', async ()  =>{
        const response = await request(app)
                .post('/api/orderItem/order-items')
                .send({
                    quantity: 1,
                    price:19.99

                })
                .set('Cookie', `access_token=${user_John}`);
                expect(response.status).toBe(400);

    });

    it('403 ', async () => {
        const response = await request(app)
            .post('/api/orderItem/order-items')
            .send({
                order_fk: 1,
                product_fk: 2,
                quantity: 50,
                price:19.99
            })
            .set('Cookie', `access_token=${user_John}`);

        expect(response.status).toBe(403);
        
    });

    it('201', async () => {
        const response = await request(app)
            .post('/api/orderItem/order-items')
            .send({
                order_fk: 1,
                product_fk: 2,
                quantity: 50,
                price:19.99
            })
            .set('Cookie', `access_token=${user_John2}`);

        expect(response.status).toBe(201);
        
    });


    it('500', async () => {
        // Simuler une erreur lors de la création de l'article

        const mockCreate = jest.spyOn(OrderItems, 'create').mockRejectedValueOnce(new Error('Erreur interne'));
    
        const response = await request(app)
            .post('/api/orderItem/order-items')
            .send({
                order_fk: 1,
                product_fk: 2,
                quantity: 50,
                price:19.99
            })
            .set('Cookie', `access_token=${user_John2}`);

        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            error: 'Erreur serveur lors de la création de l\'article de commande'
        });

        mockCreate.mockRestore();

    });
});
