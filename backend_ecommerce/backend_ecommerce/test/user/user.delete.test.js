import request from 'supertest';
import { app } from '../../server.js'; // Assurez-vous que le chemin est correct
import { prepareDatabase, teardownDatabase, getUserToken } from '../../serverTest.js';

describe('DELETE /api/user/delete/:id', () => {
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

    it('404 - should return user not found', async () => {

        const response = await request(app).delete('/api/user/delete/999'); // Assurez-vous que l'URL est correcte
        expect(response.status).toBe(404);
        expect(response.body).toEqual({"message": "User not found!"});
    });


    it('200 - should delete a user by ID', async () => {
        const response = await request(app).delete('/api/user/delete/1'); // Assurez-vous que l'URL est correcte
        console.log("__ff",response.error)
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: "User deleted" });

    });
  

    it('500 - should return internal server error', async () => {
        // Mock de User.destroy pour lever une erreur
        const { User } = require('../../models/index.js');
    
        User.destroy= jest.fn().mockRejectedValue(new Error('Erreur de suppression'))

        const response = await request(app).delete('/api/user/delete/2'); // Assurez-vous que l'URL est correcte
        expect(response.status).toBe(500);
    
    }, 10000); // Augmentez le délai à 10 000 ms (10 secondes)
    
});
