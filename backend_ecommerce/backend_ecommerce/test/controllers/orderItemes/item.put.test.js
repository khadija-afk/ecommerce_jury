import request from 'supertest';
import { prepareDatabase, teardownDatabase, getUserToken } from 'serverTest.js';
import { app } from 'server.js';
import { OrderItems } from 'models/index.js';

describe('PUT /api/orderItem/order-items/:id', () => {
    let user_john3;

    beforeAll(async () => {
        await prepareDatabase();
        user_john3 = await getUserToken('john3.doe3@example.com');
    });

    afterAll(async () => {
        await teardownDatabase();
    });

    afterEach(() => {
        jest.restoreAllMocks(); // Restaurer les mocks après chaque test
    });

    it('404 - Order item not found', async () => {
        // Test avec un article de commande non existant (id: 33)
        const response = await request(app)
            .put('/api/orderItem/order-items/33')
            .set('Cookie', `access_token=${user_john3}`)
            .send({
                order_fk: 1,
                product_fk: 1,
                quantity: 10,
                price: 50
            });

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: 'Article de commande non trouvé' });
    });

    it('200 - Successfully updates order item', async () => {
        // Récupérer l'article de commande dans la base de données avant de le mettre à jour
        const orderItem = await OrderItems.findOne({
            where: { id: 1 }  // Assurez-vous que cet ID existe
        });
    
        console.log('Order item before update:', orderItem);
    
        const response = await request(app)
            .put(`/api/orderItem/order-items/1`)
            .set('Cookie', `access_token=${user_john3}`)
            .send({
                id:1,
                quantity: 200
            });
    
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('quantity', 200);
    });
    

    it('500 - Server error during update', async () => {
        // Mock de `OrderItems.findOne` pour retourner un article de commande avec une erreur de mise à jour
        const mockOrderItem = {
            id: 1,
            update: jest.fn().mockRejectedValue(new Error('Erreur de réseau'))
        };

        jest.spyOn(OrderItems, 'findOne').mockResolvedValue(mockOrderItem);

        const response = await request(app)
            .put('/api/orderItem/order-items/1')
            .set('Cookie', `access_token=${user_john3}`)
            .send({
                order_fk: 1,
                product_fk: 1,
                quantity: 200,
                price: 100
            });

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'Erreur serveur lors de la mise à jour de l\'article de commande' });
    });
});
