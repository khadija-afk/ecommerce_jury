import request from 'supertest';
import { app } from 'server.js'; // Assurez-vous que le chemin est correct
import { prepareDatabase, teardownDatabase, getUserToken,  } from 'serverTest.js';
import { OrderItems } from 'src/models/index.js';




describe('GET /api/orderItem/order-items/:id', () => {

    let user_john3;
    let user_john;

    
    
    beforeAll(async () => {
        await prepareDatabase();
        user_john3 = await getUserToken('john3.doe3@example.com');
        user_john = await getUserToken('john.doe@example.com');
    });

    afterAll(async () => {
        await teardownDatabase();
    });

    afterEach(() => {
        jest.restoreAllMocks(); // Restaurer les mocks après chaque test
    });

    it('404', async () => {
        const response = await request(app)
            .get('/api/orderItem/order-items/3')
            .set('Cookie', `access_token=${user_john3}`);
        expect(response.status).toBe(404);  
       
    });

    it('200', async () => {
        const response = await request(app)
            .get('/api/orderItem/order-items/1')
            .set('Cookie', `access_token=${user_john3}`);
        expect(response.status).toBe(200);
        
       
    });

   

    it('500 - Server error while retrieving the order item', async () => {
        // Mock de la méthode findByPk pour simuler une erreur de réseau
        const mockFindByPk = jest.spyOn(OrderItems, 'findByPk').mockRejectedValue(new Error('Erreur de réseau'));
    
        // Exécuter la requête GET pour récupérer un OrderItem
        const response = await request(app)
            .get('/api/orderItem/order-items/13')
            .set('Cookie', `access_token=${user_john3}`);
    
        // Vérifier le statut et le message d'erreur
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'Server error while findByPk' });
    
        // Restaurer la méthode originale après le test
        mockFindByPk.mockRestore();
    });
    
    
})