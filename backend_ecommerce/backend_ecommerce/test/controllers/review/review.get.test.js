import request from 'supertest';
import { app } from 'server.js'; // Assurez-vous que le chemin est correct
import { prepareDatabase, teardownDatabase, getUserToken } from 'serverTest.js';

describe('GET /api/review', () => {

  
   
    
    beforeAll(async () => {
        await prepareDatabase();
        
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
            .get('/api/review')
            
        expect(response.status).toBe(200);  
    });
    it('500', async () => {
    
        const { Review } = require('src/models/index.js');
    
        Review.findAll = jest.fn().mockRejectedValue(new Error('Server error while getting reviews'))

        const response = await request(app)
            .get('/api/review')
            
        expect(response.status).toBe(500); 
    });
    
})