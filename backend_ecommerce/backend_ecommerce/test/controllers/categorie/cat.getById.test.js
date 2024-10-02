import request from 'supertest';
import { app } from 'server.js'; // Assurez-vous que le chemin est correct
import { Categorie } from 'models/index.js'; // Importez votre modèle de catégorie

describe('GET /api/categorie/:id', () => {
    afterEach(() => {
        jest.restoreAllMocks(); // Restaurer les mocks après chaque test
    });

    it('200 - should return a category by ID', async () => {
        // Mock de Categorie.findByPk pour simuler la récupération d'une catégorie
        const mockCategory = { id: 1, name: 'Electronics' };

        Categorie.findByPk = jest.fn().mockResolvedValue(mockCategory); // Simuler la fonction findByPk

        const response = await request(app).get('/api/categorie/1'); // Assurez-vous que l'URL est correcte
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockCategory); // Vérifiez que la réponse contient la catégorie simulée

        // Vérifier que findByPk a bien été appelé avec l'ID correct (convertir en nombre)
        expect(Categorie.findByPk).toHaveBeenCalledWith("1", {}); // Utilisez `1` comme nombre ici
    });

    it('404 - should return category not found', async () => {
        // Mock de Categorie.findByPk pour simuler qu'aucune catégorie n'a été trouvée
        Categorie.findByPk = jest.fn().mockResolvedValue(null); // Simuler qu'aucune catégorie n'a été trouvée

        const response = await request(app).get('/api/categorie/999'); // Assurez-vous que l'URL est correcte
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: 'Not found' });

        // Vérifier que findByPk a bien été appelé avec l'ID correct (convertir en nombre)
        expect(Categorie.findByPk).toHaveBeenCalledWith("999", {}); // Utilisez `999` comme nombre ici
    });

    it('500 - should return internal server error', async () => {
        // Mock de Categorie.findByPk pour lever une erreur
        Categorie.findByPk = jest.fn().mockRejectedValue(new Error('Erreur lors de la récupération de la catégorie'));

        const response = await request(app).get('/api/categorie/1'); // Assurez-vous que l'URL est correcte
        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            error: 'Server error while findByPk'
        });

        // Vérifier que findByPk a bien été appelé avec l'ID correct (convertir en nombre)
        expect(Categorie.findByPk).toHaveBeenCalledWith("1", {}); // Utilisez `1` comme nombre ici
    });
});
