import request from 'supertest';
import { app } from 'server.js'; // Assurez-vous que le chemin est correct
import { prepareDatabase, teardownDatabase, getUserToken } from 'serverTest.js';

describe('POST /api/review', () => {

    let user_john;

    beforeAll(async () => {
        await prepareDatabase();
        user_john = await getUserToken('john.doe@example.com');
    });

    afterAll(async () => {
        await teardownDatabase();
    });

    afterEach(() => {
        jest.restoreAllMocks(); // Restaurer les mocks après chaque test
    });

    it('201', async () => {
    
        // Effectuer la requête avec un en-tête Authorization
        const response = await request(app)
            .post('/api/review')
            .set('Cookie', `access_token=${user_john}`)
            .send({
                user_fk: 1,
                product_fk: 1,
                rating: 5,
                comment: "exellent"
            })
            
        expect(response.status).toBe(201);  
    });
    it('500', async () => {
    
        const { Review } = require('models/index.js');
    
        Review.create = jest.fn().mockRejectedValue(new Error('Server error while creating review'))

        const response = await request(app)
            .post('/api/review')
            .set('Cookie', `access_token=${user_john}`)
            .send({
                user_fk: 1,
                product_fk: 1,
                rating: 5,
                comment: "exellent"
            })
            
        expect(response.status).toBe(500); 
    });
    
})