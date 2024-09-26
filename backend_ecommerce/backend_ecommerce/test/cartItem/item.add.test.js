import request from 'supertest';
import { prepareDatabase, teardownDatabase, getUserToken } from '../../serverTest.js';
import { app } from '../../server.js';

describe('POST /api/cartItem/cart-items', () => {
    
    let user_john;
    let user_John2;
   

    beforeAll(async () => {
        await prepareDatabase();
        user_john = await getUserToken('john.doe@example.com');
        user_John2 = await getUserToken('john2.doe2@example.com');

    });
    
    afterAll(async () => {
        await teardownDatabase();
    });

    afterEach(() => {
        jest.restoreAllMocks(); // Restaurer les mocks après chaque test
    });

    it('201 already have Cart', async () => {
        const response = await request(app)
            .post('/api/cartItem/cart-items')
            .send({
                cart_fk: 1,
                product_fk: 2,
                quantity: 50
            })
            .set('Cookie', `access_token=${user_john}`);

        expect(response.status).toBe(201);
        expect(response.body).toEqual(expect.objectContaining({
            cart_fk: 1,
            product_fk: 2,
            quantity: 50
        }));
        
    });

    it('201 For first Cart', async () => {
        const response = await request(app)
            .post('/api/cartItem/cart-items')
            .send({
                product_fk: 2,
                quantity: 50
            })
            .set('Cookie', `access_token=${user_John2}`);

        expect(response.status).toBe(201);
        expect(response.body).toEqual(expect.objectContaining({
            cart_fk: 2,
            product_fk: 2,
            quantity: 50
        }));
        
    });

    it('200 ', async () => {
        const response = await request(app)
            .post('/api/cartItem/cart-items')
            .send({
                id: 1,
                cart_fk: 1,
                product_fk: 1,
                quantity: 50
            })
            .set('Cookie', `access_token=${user_john}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.objectContaining({
            cart_fk: 1,
            product_fk: 1,
            quantity: 60
        }));
        
        
    });


    it('500', async () => {
        // Simuler une erreur lors de la création de l'article
    
        const response = await request(app)
            .post('/api/cartItem/cart-items')
            .send({
                id: 1,
                cart_fk: 100,
                product_fk: 187,
                quantity: 50
            })
            .set('Cookie', `access_token=${user_John2}`);

        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            error: 'Erreur serveur lors de l\'ajout de l\'article au panier'
        });

    });
});
