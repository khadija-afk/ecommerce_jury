import request from 'supertest';
import { prepareDatabase, teardownDatabase, getUserToken } from 'serverTest.js';
import { app } from 'server.js';

describe('PUT /api/cartItem/cart-items/:id', () => {

    let user_john;
    
    beforeAll(async () => {
        await prepareDatabase();
        user_john = await getUserToken('john.doe@example.com');
    });
    
    afterAll(async () => {
        await teardownDatabase();
    });

    afterEach(() => {
        jest.fn().mockRestore();
    });

    it('404', async () => {

        const response = await request(app)
                                .put('/api/cartItem/cart-items/123')
                                .set('Cookie', `access_token=${user_john}`);
        expect(response.status).toBe(404);
    });

    it('200', async () => {

        const response = await request(app)
                                .put('/api/cartItem/cart-items/1')
                                .send({
                                    quantity: 23
                                }).set('Cookie', `access_token=${user_john}`);
        expect(response.status).toBe(200);
    });

    it('500', async () => {
    
        const { CartItem } = require('src/models/index.js');
        CartItem.update = jest.fn().mockRejectedValue(new Error('Erreur de réseau'));

        const mockCartItem = {
            id: 1,
            update: jest.fn().mockRejectedValue(new Error('Erreur de réseau'))
        };
    
        CartItem.findByPk = jest.fn().mockResolvedValue(mockCartItem); // Mock de la fonction
    

        const response = await request(app)
            .put('/api/cartItem/cart-items/1')
            .set('Cookie', `access_token=${user_john}`);

        expect(response.status).toBe(500);

    });
});


