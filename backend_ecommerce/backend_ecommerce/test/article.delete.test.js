import request from 'supertest';
import { prepareDatabase, teardownDatabase } from '../serverTest.js';
import { app } from '../server.js';
import jwt from 'jsonwebtoken';
import { env } from '../config.js'; // Assurez-vous d'importer la configuration correcte


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
    });


    it('deleteById - 404', async () => {
        const response = await request(app).get('/api/article/999');
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: 'Article non trouvé' });
    });

    it('deleteById - 500', async () => {
        const { Article } = require('../models/index.js');
        let userToken;
        userToken = jwt.sign({ id: 1, email: 'john.doe@example.com' }, env.token); // Signer le token avec une clé secrète

        // Utiliser jest.spyOn pour intercepter l'appel à findByPk et simuler une erreur
        Article.findByPk = jest.fn().mockRejectedValue(new Error('Erreur de Réseau'))
    
        const response = await request(app)
                                .delete('/api/article/1')
                                .set('Cookie', `access_token=${userToken}`);
                                
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'Error lors de la suppression' });

        Article.findByPk.mockRestore?.();
    });

});


