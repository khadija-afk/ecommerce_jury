import request from 'supertest';
import { prepareDatabase, teardownDatabase, getUserToken } from 'serverTest.js';
import { app } from 'server.js';
import { Article } from 'src/models/index.js';

describe('POST /api/article', () => {
    
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

    it('201 ', async () => {
        const response = await request(app)
            .post('/api/article')
            .send({
                name: 'New Article 3',
                content: 'Content of new article',
                brand: 'New Brand',
                price: 20.99,
                stock: 50,
                categorie_fk: 1, // Assurez-vous que cette catégorie existe dans la base de données de test
                photo: null,
            })
            .set('Cookie', `access_token=${user_john}`);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.name).toBe('New Article 3');
    });

    it('404 ', async () => {
        // Simuler un utilisateur inexistant
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
            .set('Cookie', `access_token=${fake_user}`);

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: 'Not found' });
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
            .set('Cookie', `access_token=${user_john}`);

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: 'Not found' });
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
            .set('Cookie', `access_token=${user_john}`);

        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            error: 'Erreur lors de la création ! 😭',
            details: 'Erreur interne'
        });

        mockCreate.mockRestore();
    });
});
