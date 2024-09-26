import request from 'supertest';
import { prepareDatabase, teardownDatabase, getUserToken } from '../../serverTest.js';
import { app } from '../../server.js';
import { CartItem } from '../../models/index.js';

describe('POST /api/cartItem/cart-items', () => {
    
    let user_john;
   

    beforeAll(async () => {
        await prepareDatabase();
        user_john = await getUserToken('john.doe@example.com');
    });
    
    afterAll(async () => {
        await teardownDatabase();
    });

    afterEach(() => {
        jest.restoreAllMocks(); // Restaurer les mocks après chaque test
    });

    it('201 ', async () => {
        const response = await request(app)
            .post('/api/cartItem/cart-items')
            .send({
                id: 1,
            cart_fk: 1,
            product_fk: 1,
            quantity: 50
            })
            .set('Cookie', `access_token=${user_john}`);

        expect(response.status).toBe(201);
        
    });


    it('200 ', async () => {
        const response = await request(app)
            .post('/api/cartItem/cart-items')
            .send({
                id: 1,
            cart_fk: 1,
            product_fk: 1,
            quantity: 50
            })
            .set('Cookie', `access_token=${user_john}`);

        expect(response.status).toBe(200);
        
    });


    it('500', async () => {
        // Simuler une erreur lors de la création de l'article
        const mockCreate = jest.spyOn(CartItem, 'findOne').mockRejectedValueOnce(new Error('Erreur interne'));

        const response = await request(app)
            .post('/api/cartItem/cart-items')
            .send({
                id: 1,
                cart_fk: 1,
                product_fk: 1,
                quantity: 50
            })
            .set('Cookie', `access_token=${user_john}`);

        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            error: 'Erreur serveur lors de l\'ajout de l\'article au panier'
        });

        mockCreate.mockRestore();
    });
});
