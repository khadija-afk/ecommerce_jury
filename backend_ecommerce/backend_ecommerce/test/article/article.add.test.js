import request from 'supertest';
import { prepareDatabase, teardownDatabase } from '../../serverTest.js';
import { app } from '../../server.js';
import jwt from 'jsonwebtoken';
import { env } from '../../config.js'; // Assurez-vous d'importer la configuration correcte
import { Article, User, Categorie } from '../../models/index.js';

describe('POST /api/article', () => {
    
    let userToken;

    beforeAll(async () => {
        await prepareDatabase();

        // Générer un token JWT valide pour l'utilisateur de test
        const user = await User.findOne({ where: { email: 'john.doe@example.com' } });
        userToken = jwt.sign({ id: user.id, email: user.email }, env.token); // Signer le token avec une clé secrète
    });
    
    afterAll(async () => {
        await teardownDatabase();
    });

    afterEach(() => {
        jest.restoreAllMocks(); // Restaurer les mocks après chaque test
    });

    it('201 ', async () => {
        const response = await request(app)
            .post('/api/article')
            .send({
                name: 'New Article',
                content: 'Content of new article',
                brand: 'New Brand',
                price: 20.99,
                stock: 50,
                categorie_fk: 1, // Assurez-vous que cette catégorie existe dans la base de données de test
                photo: null,
            })
            .set('Cookie', `access_token=${userToken}`);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.name).toBe('New Article');
    });

    it('404 ', async () => {
        // Simuler un utilisateur inexistant
        const fakeToken = jwt.sign({ id: 999, email: 'fakeuser@example.com' }, env.token);

        const response = await request(app)
            .post('/api/article')
            .send({
                name: 'New Article',
                content: 'Content of new article',
                brand: 'New Brand',
                price: 20.99,
                stock: 50,
                categorie_fk: 1,
                photo: null,
            })
            .set('Cookie', `access_token=${fakeToken}`);

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: 'Utilisateur non trouvé' });
    });

    it(' 404', async () => {
        const response = await request(app)
            .post('/api/article')
            .send({
                name: 'New Article',
                content: 'Content of new article',
                brand: 'New Brand',
                price: 20.99,
                stock: 50,
                categorie_fk: 999, // Catégorie inexistante
                photo: null,
            })
            .set('Cookie', `access_token=${userToken}`);

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: 'Catégorie non trouvée' });
    });

    it('500', async () => {
        // Simuler une erreur lors de la création de l'article
        const mockCreate = jest.spyOn(Article, 'create').mockRejectedValueOnce(new Error('Erreur interne'));

        const response = await request(app)
            .post('/api/article')
            .send({
                name: 'New Article',
                content: 'Content of new article',
                brand: 'New Brand',
                price: 20.99,
                stock: 50,
                categorie_fk: 1,
                photo: null,
            })
            .set('Cookie', `access_token=${userToken}`);

        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            error: 'Erreur lors de la création ! 😭',
            details: 'Erreur interne'
        });

        mockCreate.mockRestore();
    });
});
