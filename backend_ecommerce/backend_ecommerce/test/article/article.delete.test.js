import request from 'supertest';
import { prepareDatabase, teardownDatabase, getUserToken } from '../../serverTest.js';
import { app } from '../../server.js';

describe('DELETE /api/article/:id', () => {
    
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

    it('deleteById - 404', async () => {
        const response = await request(app)
            .delete('/api/article/999')
            .set('Cookie', `access_token=${user_john}`);
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: 'Article non trouvé' });
    });

    it('deleteById - 403', async () => {
        const response = await request(app)
            .delete('/api/article/1')
            .set('Cookie', `access_token=${fake_user}`);
        expect(response.status).toBe(403);
        expect(response.body).toEqual({ error: "Seul le créateur peut supprimer cet article !" })
    });

    it('deleteById - 200', async () => {
        const response = await request(app)
            .delete('/api/article/1')
            .set('Cookie', `access_token=${user_john}`);
        expect(response.status).toBe(200);
        expect(response.body).toBe('Article deleted !');

        const response_get = await request(app)
                                .get('/api/article/1')
                                .set('Cookie', `access_token=${user_john}`);
        expect(response_get.status).toBe(404);
        expect(response_get.body).toEqual({ error: "Article non trouvé" })
    });

    it('deleteById - 404', async () => {
        const response = await request(app).get('/api/article/999');
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: 'Article non trouvé' });
    });

    it('deleteById - 500', async () => {
        const { Article } = require('../../models/index.js');
        
        // Simuler une instance d'article avec une méthode destroy qui lève une erreur
        const mockArticle = {
            user_fk: 100,
            destroy: jest.fn().mockRejectedValue(new Error('Erreur de Réseau')),
        };
    
        // Mock de Article.findByPk pour retourner l'instance mockée
        Article.findByPk = jest.fn().mockResolvedValue(mockArticle);
    
        // Exécuter la requête de suppression
        const response = await request(app)
                                .delete('/api/article/100')
                                .set('Cookie', `access_token=${fake_user}`);
    
        // Vérifier le résultat attendu
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: "Erreur serveur lors de la suppression de l'article" });
    
        // Vérifier que destroy a bien été appelé
        expect(mockArticle.destroy).toHaveBeenCalled();
    
        // Restaurer le mock
        Article.findByPk.mockRestore();
    });

    it('deleteById - 501', async () => {
        const { Article } = require('../../models/index.js');
    
        // Mock de Article.findByPk pour retourner l'instance mockée
        Article.findByPk = jest.fn().mockRejectedValue(new Error('Erreur de Réseau'));
    
        // Exécuter la requête de suppression
        const response = await request(app)
                                .delete('/api/article/100')
                                .set('Cookie', `access_token=${fake_user}`);
    
        // Vérifier le résultat attendu
        expect(response.status).toBe(501);
        expect(response.body).toEqual({ error: "Erreur lors de la recherche de l'article" });
    
        // Restaurer le mock
        Article.findByPk.mockRestore();
    });

});


