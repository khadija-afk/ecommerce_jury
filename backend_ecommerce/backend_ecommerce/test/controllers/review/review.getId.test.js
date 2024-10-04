import request from 'supertest';
import { app } from 'server.js'; // Assurez-vous que le chemin est correct
import { prepareDatabase, teardownDatabase, getUserToken } from 'serverTest.js';

describe('GET /api/review/:id', () => {

  
   
    
    beforeAll(async () => {
        await prepareDatabase();
        
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
            .get('/api/review/33')
            
        expect(response.status).toBe(404);  
    });

    it('200', async () => {
    
        // Effectuer la requête avec un en-tête Authorization
        const response = await request(app)
            .get('/api/review/1')
            
        expect(response.status).toBe(200);  
    });
    it('500', async () => {
    
        const { Review } = require('models/index.js');
    
        Review.findByPk = jest.fn().mockRejectedValue(new Error('Server error while getting review'))

        const response = await request(app)
            .get('/api/review/1')
            
        expect(response.status).toBe(500); 
    });
    
})