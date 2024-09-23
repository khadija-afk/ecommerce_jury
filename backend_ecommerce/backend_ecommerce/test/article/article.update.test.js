import request from 'supertest';
import { prepareDatabase, teardownDatabase } from '../../serverTest.js';
import { app } from '../../server.js';
import jwt from 'jsonwebtoken';
import { env } from '../../config.js';
import { Article, User } from '../../models/index.js';

describe('PUT /api/article/:id', () => {

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

    it('200 ', async () => {
        const response = await request(app)
            .put('/api/article/1')
            .send({ name: 'Updated Article Name' }) // Mise à jour du champ `name`
            .set('Cookie', `access_token=${userToken}`);

        expect(response.status).toBe(200);
        expect(response.body.name).toBe('Updated Article Name'); // Vérifier que le nom a bien été mis à jour
    });

    it('404 ', async () => {
        const response = await request(app)
            .put('/api/article/999')
            .send({ name: 'Updated Article Name' })
            .set('Cookie', `access_token=${userToken}`);

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: "Article non trouvé" });
    });

    it('403 ', async () => {
        const fakeToken = jwt.sign({ id: 999, email: 'otheruser@example.com' }, env.token); // Token pour un autre utilisateur

        const response = await request(app)
            .put('/api/article/1')
            .send({ name: 'Updated Article Name' })
            .set('Cookie', `access_token=${fakeToken}`);

        expect(response.status).toBe(403);
        expect(response.body).toEqual({ error: "Seul le créateur peut modifier !" });
    });

    it('500 ', async () => {
        // Simuler une erreur lors de la mise à jour de l'article
        const mockUpdate = jest.spyOn(Article.prototype, 'update').mockRejectedValueOnce(new Error('Erreur de Réseau'));

        const response = await request(app)
            .put('/api/article/1')
            .send({ name: 'Updated Article Name' })
            .set('Cookie', `access_token=${userToken}`);

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: "Error lors de la récupération" });

        mockUpdate.mockRestore();
    });
});
