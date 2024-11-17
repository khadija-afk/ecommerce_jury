import request from 'supertest';
import { prepareDatabase, teardownDatabase, getUserToken } from 'serverTest.js';
import { app } from 'server.js';
import { Categorie } from 'src/models/index.js';

describe('PUT /api/categorie/:id', () => {
    let user_admin; // Utilisateur avec le rôle admin

    beforeAll(async () => {
        await prepareDatabase();
        user_admin = await getUserToken('john.doe@example.com'); // Rôle admin
    });

    afterAll(async () => {
        await teardownDatabase();
    });

    afterEach(() => {
        jest.restoreAllMocks(); // Restaurer les mocks après chaque test
    });

    it('404 - Not Found (Catégorie inexistante)', async () => {
        const response = await request(app)
            .put('/api/categorie/999') // ID inexistant
            .send({ name: 'Catégorie mise à jour', description: 'Description mise à jour' })
            .set('Cookie', `access_token=${user_admin}`); // Utilisateur admin

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: 'Not found' });
    });

    it('200 - Success (Catégorie mise à jour avec succès)', async () => {
        const category = await Categorie.create({
            name: 'Ancienne Catégorie',
            description: 'Ancienne Description',
        });

        const response = await request(app)
            .put(`/api/categorie/${category.id}`)
            .send({ name: 'Nouvelle Catégorie', description: 'Nouvelle Description' })
            .set('Cookie', `access_token=${user_admin}`); // Utilisateur admin

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('name', 'Nouvelle Catégorie');
        expect(response.body).toHaveProperty('description', 'Nouvelle Description');

        // Vérifier que la catégorie a été mise à jour dans la base de données
        const updatedCategory = await Categorie.findByPk(category.id);
        expect(updatedCategory.name).toBe('Nouvelle Catégorie');
        expect(updatedCategory.description).toBe('Nouvelle Description');
    });

    it('500 - Internal Server Error', async () => {
        // Simuler une erreur lors de la mise à jour
        const mockUpdate = jest.spyOn(Categorie.prototype, 'update').mockRejectedValueOnce(new Error('Erreur de mise à jour'));

        const response = await request(app)
            .put('/api/categorie/1')
            .send({ name: 'Nouvelle Catégorie', description: 'Nouvelle Description' })
            .set('Cookie', `access_token=${user_admin}`);

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'Erreur serveur lors de la mise à jour de la catégorie' });

        mockUpdate.mockRestore();
    });
});
