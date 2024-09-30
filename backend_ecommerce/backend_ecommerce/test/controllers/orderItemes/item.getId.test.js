import request from 'supertest';
import { app } from '../../../server.js'; // Assurez-vous que le chemin est correct
import { prepareDatabase, teardownDatabase, getUserToken,  } from '../../../serverTest.js';




describe('GET /api/orderItem/order-items/:id', () => {

    let user_john3;
    let user_john;

    
    
    beforeAll(async () => {
        await prepareDatabase();
        user_john3 = await getUserToken('john3.doe3@example.com');
        user_john = await getUserToken('john.doe@example.com');
    });

    afterAll(async () => {
        await teardownDatabase();
    });

    afterEach(() => {
        jest.restoreAllMocks(); // Restaurer les mocks après chaque test
    });

    it('404', async () => {
        const response = await request(app)
            .get('/api/orderItem/order-items/3')
            .set('Cookie', `access_token=${user_john3}`);
        expect(response.status).toBe(404);  
       
    });

    // it('200', async () => {
    //     const response = await request(app)
    //         .get('/api/orderItem/order-items/1')
    //         .set('Cookie', `access_token=${user_john3}`);
    //     expect(response.status).toBe(200);
    //     expect(response.body).toEqual({
    //         id: 1,
    //         order_fk: 2,
    //         product_fk: 2,
    //         quantity: 10,
    //         price: 100.99
    //     });

       
    // });

   

    // it('500', async () => {

    //     const OrderItems = require('../../../models/index.js')
    
    //     const mockfindOne = jest.spyOn(OrderItems, 'findOne').mockRejectedValueOnce(new Error('Erreur de Réseau'));

    //     const response = await request(app)
    //         .get('/api/orderItem/order-items/1')
    //         .set('Cookie', `access_token=${user_john3}`);

    //     expect(response.status).toBe(500);
    //     expect(response.body).toEqual({ error: "Erreur serveur lors de la récupération de l\'article de commande" });

    //     mockfindOne.mockRestore();
    // });
    
})