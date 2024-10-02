import request from 'supertest';
import { prepareDatabase, teardownDatabase, getUserToken } from 'serverTest.js';
import { app } from 'server.js';

describe('DELETE /api/cartItem/cart-items/:id', () => {

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
                                .delete('/api/cartItem/cart-items/123')
                                .set('Cookie', `access_token=${user_john}`);
        expect(response.status).toBe(404);
    });

    it('500', async () => {
        const { CartItem } = require('models/index.js');
        CartItem.destroy = jest.fn().mockRejectedValue(new Error('Erreur de réseau'));

        const response = await request(app)
                                .delete('/api/cartItem/cart-items/1')
                                .set('Cookie', `access_token=${user_john}`);
        expect(response.status).toBe(500);
        CartItem.destroy.mockRestore();
    });

    it('204', async () => {

        const response = await request(app)
                                .delete('/api/cartItem/cart-items/1')
                                .set('Cookie', `access_token=${user_john}`);
        expect(response.status).toBe(204);
    });

    
    
});


