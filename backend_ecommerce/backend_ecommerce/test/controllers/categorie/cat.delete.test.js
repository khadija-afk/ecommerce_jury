import request from 'supertest';
import { app } from 'server.js'; // Assurez-vous que le chemin est correct
import { Categorie } from 'src/models/index.js'; // Importez votre modèle de catégorie
import { prepareDatabase, teardownDatabase, getUserToken } from 'serverTest.js';

describe('DELETE /api/categorie/:id', () => {
    let user_admin; // Utilisateur avec le rôle admin
    let user_standard; // Utilisateur avec un rôle standard

    beforeAll(async () => {
        await prepareDatabase();
        user_admin = await getUserToken('john.doe@example.com'); // Rôle admin
        user_standard = await getUserToken('john2.doe2@example.com'); // Rôle standard
    });

    afterAll(async () => {
        await teardownDatabase();
    });

    it('403 - Forbidden (Utilisateur sans autorisation)', async () => {
        const response = await request(app)
            .delete('/api/categorie/1')
            .set('Cookie', `access_token=${user_standard}`); // Utilisateur standard

        expect(response.status).toBe(403);
        expect(response.body).toEqual({ error: 'Accès interdit' });
    });

    it('404 - Not Found (Catégorie inexistante)', async () => {
        const response = await request(app)
            .delete('/api/categorie/999') // ID inexistant
            .set('Cookie', `access_token=${user_admin}`); // Utilisateur admin

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: 'Not found' });
    });

    it('200 - Success (Catégorie supprimée avec succès)', async () => {
        const category = await Categorie.create({
            name: 'Test Catégorie',
            description: 'Catégorie pour test de suppression',
        });

        const response = await request(app)
            .delete(`/api/categorie/${category.id}`)
            .set('Cookie', `access_token=${user_admin}`); // Utilisateur admin

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'Categorie deleted' });

        // Vérifiez que la catégorie est supprimée
        const deletedCategory = await Categorie.findByPk(category.id);
        expect(deletedCategory).toBeNull();
    });

    it('500 - Internal Server Error', async () => {
        // Mock pour simuler une erreur serveur
        const findByPkSpy = jest.spyOn(Categorie, 'findByPk').mockRejectedValue(new Error('Erreur lors de la suppression'));

        const response = await request(app)
            .delete('/api/categorie/1')
            .set('Cookie', `access_token=${user_admin}`); // Utilisateur admin

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'Server error while findByPk' });

        findByPkSpy.mockRestore(); // Restaurer la méthode originale
    });
});
