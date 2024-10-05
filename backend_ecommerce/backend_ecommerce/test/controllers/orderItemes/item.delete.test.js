import request from 'supertest';
import { prepareDatabase, teardownDatabase, getUserToken } from 'serverTest.js';
import { app } from 'server.js';

describe('DELETE /api/orderItem/order-items/:id', () => {

    let user_john3;
    
    beforeAll(async () => {
        await prepareDatabase();
        user_john3 = await getUserToken('john3.doe3@example.com');
    });
    
    afterAll(async () => {
        await teardownDatabase();
    });

    afterEach(() => {
        jest.fn().mockRestore();
    });

    it('404', async () => {

        const response = await request(app)
                                .delete('/api/orderItem/order-items/33')
                                .set('Cookie', `access_token=${user_john3}`);
        expect(response.status).toBe(404);
    });

    it('500 - Should handle server error during deletion', async () => {
        const { OrderItems } = require('src/models/index.js');
    
        const mockOrderItem = {
            destroy: jest.fn().mockRejectedValue(new Error('Erreur de réseau'))
        };
        jest.spyOn(OrderItems, 'findOne').mockResolvedValue(mockOrderItem);
    
        
        const response = await request(app)
                                .delete('/api/orderItem/order-items/1')
                                .set('Cookie', `access_token=${user_john3}`);
    
        
        expect(response.status).toBe(500);
        expect(response.body.error).toEqual('Erreur serveur lors de la suppression de l\'article de commande');
    
        
        OrderItems.findOne.mockRestore();
        mockOrderItem.destroy.mockRestore();
    });
    

    it('200', async () => {

        const response = await request(app)
                                .delete('/api/orderItem/order-items/1')
                                .set('Cookie', `access_token=${user_john3}`);
        expect(response.status).toBe(200);
    });

});


