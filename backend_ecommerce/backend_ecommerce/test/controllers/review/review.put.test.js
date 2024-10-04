import request from 'supertest';
import { app } from 'server.js'; // Assurez-vous que le chemin est correct
import { prepareDatabase, teardownDatabase, getUserToken } from 'serverTest.js';

describe('PUT /api/review', () => {

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

    it('404', async () => {
    
        // Effectuer la requête avec un en-tête Authorization
        const response = await request(app)
            .put('/api/review/33')
            .set('Cookie', `access_token=${user_john}`)
            .send({
                rating: 3.5,
            })
            
        expect(response.status).toBe(404);  
    });

    it('200', async () => {
    
        // Effectuer la requête avec un en-tête Authorization
        const response = await request(app)
            .put('/api/review/1')
            .set('Cookie', `access_token=${user_john}`)
            .send({
                rating: 3.5,
            })
            
        expect(response.status).toBe(200);  
    });
    it('500', async () => {
    
        const { Review } = require('models/index.js');

        const mockreview = {
            id: 1,
            update: jest.fn().mockRejectedValue(new Error('Erreur de réseau'))
        };
    
        Review.findByPk = jest.fn().mockResolvedValue(mockreview); 

        const response = await request(app)
            .put('/api/review/1')
            .set('Cookie', `access_token=${user_john}`)
            .send({
               
                rating: 4.5,
                
            })
            
        expect(response.status).toBe(500); 
    });
    
})