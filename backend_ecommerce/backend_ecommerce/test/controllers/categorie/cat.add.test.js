import request from 'supertest';
import { prepareDatabase, teardownDatabase, getUserToken } from 'serverTest.js';
import { app } from 'server.js';
import { Categorie } from 'src/models/index.js';

describe('POST /api/categorie', () => {
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

    it('201 - Success (Catégorie créée avec succès)', async () => {
        const response = await request(app)
            .post('/api/categorie')
            .send({
                name: 'Nouvelle Catégorie',
                description: 'Description de la nouvelle catégorie',
            })
            .set('Cookie', `access_token=${user_admin}`); // Utilisateur admin

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('name', 'Nouvelle Catégorie');
        expect(response.body).toHaveProperty('description', 'Description de la nouvelle catégorie');

        // Vérifier que la catégorie a été créée dans la base de données
        const createdCategory = await Categorie.findByPk(response.body.id);
        expect(createdCategory.name).toBe('Nouvelle Catégorie');
        expect(createdCategory.description).toBe('Description de la nouvelle catégorie');
    });

    it('400 - Bad Request (Données invalides)', async () => {
        const response = await request(app)
            .post('/api/categorie')
            .send({
                description: 'Description sans nom', // Champ `name` manquant
            })
            .set('Cookie', `access_token=${user_admin}`); // Utilisateur admin

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            error: 'Le nom de la catégorie est requis',
        });
    });

    it('500 - Internal Server Error', async () => {
        // Simuler une erreur lors de la création
        const mockCreate = jest.spyOn(Categorie, 'create').mockRejectedValueOnce(new Error('Erreur lors de la création'));

        const response = await request(app)
            .post('/api/categorie')
            .send({
                name: 'Erreur Catégorie',
                description: 'Catégorie qui génère une erreur',
            })
            .set('Cookie', `access_token=${user_admin}`); // Utilisateur admin

        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            error: 'Erreur serveur lors de la création de la catégorie',
        });

        mockCreate.mockRestore();
    });
});
