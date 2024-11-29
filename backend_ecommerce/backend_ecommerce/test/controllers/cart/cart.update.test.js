import request from 'supertest';
import { prepareDatabase, teardownDatabase, getUserToken } from 'serverTest.js';
import { app } from 'server.js';
import { Cart } from 'src/models/index.js';

describe('PUT /api/cart/cart', () => {

    let user_john;
    let user_john2;
    

    beforeAll(async () => {
        await prepareDatabase();
        user_john = await getUserToken('john.doe@example.com');
        user_john2 = await  getUserToken('john2.doe2@example.com');
        
    });

    afterAll(async () => {
        await teardownDatabase();
    });

    afterEach(() => {
        jest.restoreAllMocks(); // Restaurer les mocks après chaque test
    });

    it('400 ', async () => {
        const response = await request(app)
            .put('/api/cart/cart')
            .send({ totalAmount: null}) // Mise à jour du champ `name`
            .set('Cookie', `access_token=${user_john}`);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'Montant total invalide');
    });

    it('404 ', async () => {
        const response = await request(app)
            .put('/api/cart/cart')
            .send({ totalAmount: 50 })
            .set('Cookie', `access_token=${user_john2}`);

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: "Panier non trouvé pour cet utilisateur" });
    });

    it('200 ', async () => {

        const response = await request(app)
            .put('/api/cart/cart')
            .send({totalAmount: 19.99 })
            .set('Cookie', `access_token=${user_john}`);

        expect(response.status).toBe(200);
        
    });

    it('500 ', async () => {
        // Simuler une erreur lors de la mise à jour de l'article
        const mockUpdate = jest.spyOn(Cart.prototype, 'update').mockRejectedValueOnce(new Error('Erreur de Réseau'));

        const response = await request(app)
            .put('/api/cart/cart')
            .send({ totalAmount: 19.99 })
            .set('Cookie', `access_token=${user_john}`);

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: "Erreur serveur lors de la mise à jour du montant total du panier" });

        mockUpdate.mockRestore();
    });
});
