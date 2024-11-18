import request from 'supertest';
import { app } from 'server.js';
import { prepareDatabase, teardownDatabase, getUserToken } from 'serverTest.js';
import { Favorite, Article } from 'src/models/index.js';
import jwt from 'jsonwebtoken';

describe('Favorite Controller Tests', () => {
    let userToken;
    let userId;
    let article;

    beforeAll(async () => {
        await prepareDatabase();
        const user = await getUserToken('john.doe@example.com'); // Retourne un token
        userToken = user;
        userId = jwt.decode(user).id; // Décoder le token pour récupérer l'ID

        // Créer un article pour tester les favoris
        article = await Article.create({
            name: 'Test Article',
            content: 'Description of the test article',
            brand: 'nike',
            price: 25.5,
            stock: 10,
            photo: 'test-photo.jpg',
            categorie_fk: 1,
            user_fk: userId,
        });
    });

    afterAll(async () => {
        await teardownDatabase();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('POST /api/favorie - Add favorite (201)', async () => {
        const response = await request(app)
            .post('/api/favorie')
            .set('Cookie', `access_token=${userToken}`)
            .send({ product_fk: article.id });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('user_fk', userId);
        expect(response.body).toHaveProperty('product_fk', article.id);
    });

    it('GET /api/favorie - Get user favorites (200)', async () => {
        await Favorite.create({ user_fk: userId, product_fk: article.id });

        const response = await request(app)
            .get('/api/favorie')
            .set('Cookie', `access_token=${userToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body[0]).toHaveProperty('product_fk', article.id);
        expect(response.body[0]).toHaveProperty('Article');
        expect(response.body[0].Article).toHaveProperty('name', 'Test Article');
    });

    it('DELETE /api/favorie - Remove favorite (200)', async () => {
        await Favorite.create({ user_fk: userId, product_fk: article.id });

        const response = await request(app)
            .delete('/api/favorie')
            .set('Cookie', `access_token=${userToken}`)
            .send({ product_fk: article.id });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Favori supprimé avec succès.');
    });

    it('DELETE /api/favorie - Remove non-existing favorite (404)', async () => {
        const response = await request(app)
            .delete('/api/favorie')
            .set('Cookie', `access_token=${userToken}`)
            .send({ product_fk: 99999 }); // ID inexistant

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error', 'Le favori n\'existe pas.');
    });

    it('GET /api/favorie/:product_fk - Check if favorite (200)', async () => {
        await Favorite.create({ user_fk: userId, product_fk: article.id });

        const response = await request(app)
            .get(`/api/favorie/${article.id}`)
            .set('Cookie', `access_token=${userToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('isFavorite', true);
    });

    it('GET /api/favorie/:product_fk - Check non-favorite (200)', async () => {
        const response = await request(app)
            .get(`/api/favorie/99999`) // ID inexistant
            .set('Cookie', `access_token=${userToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('isFavorite', false);
    });

    it('POST /api/favorie - Server error (500)', async () => {
        jest.spyOn(Favorite, 'create').mockRejectedValue(new Error('Erreur serveur'));

        const response = await request(app)
            .post('/api/favorie')
            .set('Cookie', `access_token=${userToken}`)
            .send({ product_fk: article.id });

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('error', 'Erreur serveur');
    });
});
