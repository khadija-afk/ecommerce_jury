import request from 'supertest';
import { prepareDatabase, teardownDatabase, getUserToken } from 'serverTest.js';
import { app } from 'server.js';
import { Article } from 'src/models/index.js';

describe('PUT /api/article/:id', () => {

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

    it('200 ', async () => {
        const response = await request(app)
            .put('/api/article/1')
            .send({ name: 'Updated Article Name' }) // Mise à jour du champ `name`
            .set('Cookie', `access_token=${user_john}`);

        expect(response.status).toBe(200);
        expect(response.body.name).toBe('Updated Article Name'); // Vérifier que le nom a bien été mis à jour
    });

    it('404 ', async () => {
        const response = await request(app)
            .put('/api/article/999')
            .send({ name: 'Updated Article Name' })
            .set('Cookie', `access_token=${user_john}`);

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: "Not found" });
    });

    it('403 ', async () => {

        const response = await request(app)
            .put('/api/article/1')
            .send({ name: 'Updated Article Name' })
            .set('Cookie', `access_token=${fake_user}`);

        expect(response.status).toBe(403);
        expect(response.body).toEqual({ error: "Seul le créateur peut modifier !" });
    });

    it('500 ', async () => {
        // Simuler une erreur lors de la mise à jour de l'article
        const mockUpdate = jest.spyOn(Article.prototype, 'update').mockRejectedValueOnce(new Error('Erreur de Réseau'));

        const response = await request(app)
            .put('/api/article/1')
            .send({ name: 'Updated Article Name' })
            .set('Cookie', `access_token=${user_john}`);

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: "Error lors de la récupération" });

        mockUpdate.mockRestore();
    });
});
