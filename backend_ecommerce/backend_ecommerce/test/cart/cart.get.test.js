import request from 'supertest';
import { app } from '../../server.js'; // Assurez-vous que le chemin est correct
import jwt from 'jsonwebtoken';
import { Cart, CartItem, Article } from '../../models/index.js'; // Importez vos modèles
import { prepareDatabase, teardownDatabase, getUserToken } from '../../serverTest.js';
import { env } from '../../config.js'; // Assurez-vous d'importer la configuration correcte

describe('GET /api/cart', () => {

    let user_john;
    let fake_user;
    
    beforeAll(async () => {
        await prepareDatabase();
        user_john = await getUserToken('john.doe@example.com');
        fake_user = await getUserToken('fake@example.com');
    });

    afterAll(async () => {
        await teardownDatabase();
    });

    afterEach(() => {
        jest.restoreAllMocks(); // Restaurer les mocks après chaque test
    });

    it('400', async () => {
        // const mockCart = {
        //     id: 1,
        //     user_fk: 1,
        //     cartItems: [
        //         {
        //             id: 1,
        //             quantity: 2,
        //             article: {
        //                 id: 1,
        //                 name: 'Test Article',
        //                 price: 100,
        //                 photo: 'photo_url'
        //             }
        //         }
        //     ]
        // };
    
        // // Mock de Cart.findOne pour retourner le panier simulé
        // const findOneSpy = jest.spyOn(Cart, 'findOne').mockResolvedValue(mockCart);
    
        // Effectuer la requête avec un en-tête Authorization
        const response = await request(app)
            .get('/api/cart/cart')
            .set('Cookie', `access_token=${user_john}`);  // Utilisation de l'en-tête Authorization
        
        expect(response.status).toBe(404);  // Vérifiez bien le statut
    });
    
})