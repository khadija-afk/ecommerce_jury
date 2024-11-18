import request from 'supertest';
import { app } from 'server.js'; // Assurez-vous que le chemin est correct
import { prepareDatabase, teardownDatabase, getUserToken } from 'serverTest.js';

describe('DELETE /api/review/:id', () => {

    let user_john;
    let user_john2;

    beforeAll(async () => {
        await prepareDatabase();
        user_john = await getUserToken('john.doe@example.com');
        user_john2 = await getUserToken('john2.doe2@example.com');
    });

    afterAll(async () => {
        await teardownDatabase();
    });

    afterEach(() => {
        jest.restoreAllMocks(); // Restaurer les mocks après chaque test
    });

    it('200', async () => {
    
        // Effectuer la requête avec un en-tête Authorization
        const response = await request(app)
            .delete('/api/review/1')
            .set('Cookie', `access_token=${user_john}`)
            
            
        expect(response.status).toBe(200);  
    });
    it('500', async () => {
    
        const { Review } = require('src/models/index.js');

        const mockorder = {
            id: 1,
            destroy: jest.fn().mockRejectedValue(new Error('Erreur de réseau'))
        };
    
        Review.findByPk = jest.fn().mockRejectedValue(mockorder);

       
        const response = await request(app)
            .delete('/api/review/1')
            .set('Cookie', `access_token=${user_john}`)
           
        expect(response.status).toBe(500);  
        
    });
    
})