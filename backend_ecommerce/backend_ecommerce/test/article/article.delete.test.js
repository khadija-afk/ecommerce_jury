import request from 'supertest';
import { prepareDatabase, teardownDatabase } from '../../serverTest.js';
import { app } from '../../server.js';
import jwt from 'jsonwebtoken';
import { env } from '../../config.js'; // Assurez-vous d'importer la configuration correcte


describe('DELETE /api/article/:id', () => {
    
    beforeAll(async () => {
        await prepareDatabase();

    });
    
    afterAll(async () => {
        await teardownDatabase();
    });

    afterEach(() => {
        jest.restoreAllMocks(); // Restaurer les mocks après chaque test
    });


    it('deleteById - 404', async () => {
        let userToken;
        userToken = jwt.sign({ id: 1, email: 'john.doe@example.com' }, env.token); // Signer le token avec une clé secrète


        const response = await request(app)
            .delete('/api/article/999')
            .set('Cookie', `access_token=${userToken}`);
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: 'Article non trouvé' });
    });

    it('deleteById - 403', async () => {

        let userToken;
        userToken = jwt.sign({ id: 999, email: 'john.doe@example.com' }, env.token); // Signer le token avec une clé secrète

        const response = await request(app)
            .delete('/api/article/1')
            .set('Cookie', `access_token=${userToken}`);
        expect(response.status).toBe(403);
        expect(response.body).toEqual({ error: "Seul le créateur peut supprimer !" })
    });


    it('deleteById - 200', async () => {

        let userToken;
        userToken = jwt.sign({ id: 1, email: 'john.doe@example.com' }, env.token); // Signer le token avec une clé secrète


        const response = await request(app)
            .delete('/api/article/1')
            .set('Cookie', `access_token=${userToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toBe('Article deleted !');


        const response_get = await request(app)
                                .get('/api/article/1')
                                .set('Cookie', `access_token=${userToken}`);
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
        let userToken;
        userToken = jwt.sign({ id: 100, email: 'john.doe@example.com' }, env.token); // Signer le token avec une clé secrète
    
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
                                .set('Cookie', `access_token=${userToken}`);
    
        // Vérifier le résultat attendu
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'Error lors de la suppression' });
    
        // Vérifier que destroy a bien été appelé
        expect(mockArticle.destroy).toHaveBeenCalled();
    
        // Restaurer le mock
        Article.findByPk.mockRestore();
    });

});


