import request from 'supertest';
import { prepareDatabase, teardownDatabase, getUserToken } from 'serverTest.js';
import { app } from 'server.js';
import * as Service from 'src/services/service.js';

describe('DELETE /api/article/:id', () => {
    
    let user_john;
    let user_john2;
    let fake_user;

    beforeAll(async () => {
        await prepareDatabase();
        user_john = await getUserToken('john.doe@example.com');
        user_john2 = await getUserToken('john2.doe2@example.com');
        fake_user = await getUserToken('fake@example.com');
    });
    
    afterAll(async () => {
        await teardownDatabase();
    });

    afterEach(() => {
        jest.restoreAllMocks(); // Restaurer les mocks après chaque test
    });

    it('deleteById - 404', async () => {
        const response = await request(app)
            .delete('/api/article/999')
            .set('Cookie', `access_token=${user_john}`);
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: 'Not found' });
    });

    // it('deleteById - 403', async () => {
    //     const response = await request(app)
    //         .delete('/api/article/1') // Article créé par user_john
    //         .set('Cookie', `access_token=${fake_user}`); // Utilisateur non autorisé
    
    //     expect(response.status).toBe(404);
    //     expect(response.body).toEqual({ error: "Accès interdit" });
    // });
    

    it('deleteById - 200', async () => {
        const response = await request(app)
            .delete('/api/article/1') // Article créé par user_john
            .set('Cookie', `access_token=${user_john}`);
    
        expect(response.status).toBe(200);
        expect(response.body).toBe('Article deleted !');
    
        // Vérifiez que l'article n'existe plus
        const verifyResponse = await request(app)
            .get('/api/article/1')
            .set('Cookie', `access_token=${user_john}`);
        expect(verifyResponse.status).toBe(404);
    });
    

    it('deleteById - 404', async () => {
        const response = await request(app).get('/api/article/999');
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: 'Not found' });
    });

    it('deleteById - 500', async () => {
        const mockArticle = {
            destroy: jest.fn().mockRejectedValue(new Error('Erreur serveur')),
        };
    
        jest.spyOn(Service, 'get').mockResolvedValue(mockArticle);
    
        const response = await request(app)
            .delete('/api/article/1')
            .set('Cookie', `access_token=${user_john}`);
    
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: "Erreur serveur lors de la suppression" });
    
        // Vérifiez que `destroy` a bien été appelé
        expect(mockArticle.destroy).toHaveBeenCalled();
    
        jest.restoreAllMocks();
    });
    

});


