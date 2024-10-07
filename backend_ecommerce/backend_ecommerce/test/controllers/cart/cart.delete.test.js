import request from 'supertest';
import { app } from 'server.js'; 
import { prepareDatabase, teardownDatabase, getUserToken } from 'serverTest.js';

describe('DELETE /api/cart', () => {

    let user_john;
    let user_John2;
    let fake_user;
    
    beforeAll(async () => {
        await prepareDatabase();
        user_john = await getUserToken('john.doe@example.com');
        user_John2 = await getUserToken('john2.doe2@example.com');
        fake_user = await getUserToken('fake@example.com');
    });

    afterAll(async () => {
        await teardownDatabase();
    });

    afterEach(() => {
        jest.restoreAllMocks(); 
    });

    it('204', async () => {
    
        
        const response = await request(app)
            .delete('/api/cart/cart/1')
            .set('Cookie', `access_token=${user_john}`);  
        
        expect(response.status).toBe(204);  
    });

    it('404', async () => {
    
       
        const response = await request(app)
            .delete('/api/cart/cart/33')
            .set('Cookie', `access_token=${user_John2}`);  
        
        expect(response.status).toBe(404);  
    });

    it.only('500', async () => {
    
        const { Cart } = require('src/models/index.js');

        const mockCart = {
            id: 1,
            name: "Cart",
            user_fk: 1,
            destroy: jest.fn().mockRejectedValue(
                    { error: 'Erreur de suppression', status: 500 }
                )
        };

       
        Cart.findByPk = jest.fn().mockResolvedValue(mockCart); 
        const response = await request(app)
            .delete('/api/cart/cart/1')
            .set('Cookie', `access_token=${user_john}`);  
        
        expect(response.status).toBe(500);  
    });
    
})