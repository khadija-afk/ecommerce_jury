import request from 'supertest';
import { prepareDatabase, teardownDatabase, getUserToken } from 'serverTest.js';
import { app } from 'server.js';
import { CartItem } from 'src/models/index.js';

describe('GET /api/cartItem/cart-items/:id', () => {

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

    it('200', async () => {

        const response = await request(app)
                                .get('/api/cartItem/cart-items/1')
                                .set('Cookie', `access_token=${user_john}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            id: 1,
            cart_fk:1,
            product_fk:1,
            quantity: 10
        });
    });

    it('404', async () => {
        const response = await request(app)
                .get('/api/cartItem/cart-items/999')
                .set('Cookie', `access_token=${user_john}`)
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: 'Not found' });
    });

    it('500', async () => {
        
    
        // Utiliser jest.spyOn pour intercepter l'appel à findByPk et simuler une erreur
        CartItem.findByPk = jest.fn().mockRejectedValue(new Error('Erreur de Réseau'))
    
        const response = await request(app)
        .get('/api/cartItem/cart-items/1')
        .set('Cookie', `access_token=${user_john}`)
        
        
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'Server error while findByPk' });

        CartItem.findByPk.mockRestore?.();
    });



    
});


