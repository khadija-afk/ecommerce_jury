import request from 'supertest';
import { prepareDatabase, teardownDatabase, getUserToken } from '../../../serverTest.js';
import { app } from '../../../server.js';
import { OrderItems } from '../../../models/index.js';

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

    it('200', async () => {

        const response = await request(app)
                                .delete('/api/orderItem/order-items/1')
                                .set('Cookie', `access_token=${user_john3}`);
        expect(response.status).toBe(200);
    });

    // it('500', async () => {

    //     OrderItems.destroy = jest.fn().mockRejectedValue(new Error('Erreur de réseau'));

    //     const response = await request(app)
    //                             .delete('/api/orderItem/order-items/1')
    //                             .set('Cookie', `access_token=${user_john3}`);
    //     expect(response.status).toBe(500);
    //     OrderItems.destroy.mockRestore();
    // });

    
    
});


