import request from 'supertest';
import { app } from '../../server.js'; // Assurez-vous que le chemin est correct
import { prepareDatabase, teardownDatabase, getUserToken,  } from '../../serverTest.js';
import { CartItem } from '../../models/index.js';


describe('GET /api/cartItem/cart-items', () => {

    let user_john;
    let user_John2;

    
    
    beforeAll(async () => {
        await prepareDatabase();
        user_John2 = await getUserToken('john2.doe2@example.com');

        await CartItem.create({
            id: 1,
            cart_fk: 1,
            product_fk: 1,
            quantity: 50
        });

        
    });

    afterAll(async () => {
        await teardownDatabase();
    });

    afterEach(() => {
        jest.restoreAllMocks(); // Restaurer les mocks après chaque test
    });

    it('200', async () => {
        const response = await request(app)
            .get('/api/cartItem/cart-items')
            .set('Cookie', `access_token=${user_John2}`);
        expect(response.status).toBe(200);  
        expect(response.body).toEqual([{
           id: 1,
            cart_fk:1,
            product_fk:1,
            quantity:50

        }])
    });

   

    it('500', async () => {
    
        const mockFindAll = jest.spyOn(CartItem, 'findAll').mockRejectedValueOnce(new Error('Erreur de Réseau'));

        const response = await request(app)
            .get('/api/cartItem/cart-items')
            .set('Cookie', `access_token=${user_John2}`);

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: "Erreur serveur lors de la récupération des articles du panier" });

        mockFindAll.mockRestore();
    });
    
})