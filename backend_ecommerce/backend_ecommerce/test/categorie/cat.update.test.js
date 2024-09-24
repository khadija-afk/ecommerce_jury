import request from 'supertest';
import { app } from '../../server.js'; // Assurez-vous que le chemin est correct
import { Categorie } from '../../models/index.js'; // Importez votre modèle de catégorie

describe('PUT /api/categorie/:id', () => {

    afterEach(() => {
        jest.restoreAllMocks(); // Restaurer les mocks après chaque test
    });

    it('200 - should update a category by ID', async () => {
        // Catégorie simulée avant mise à jour
        const mockCategory = {
            id: 1,
            name: 'Old Electronics',
            description: 'Old devices and gadgets',
            update: jest.fn() // Simuler la méthode update
        };

        // Mock de Categorie.findByPk pour retourner la catégorie simulée
        const findByPkSpy = jest.spyOn(Categorie, 'findByPk').mockResolvedValue(mockCategory);

        // Faire la requête PUT pour mettre à jour la catégorie
        const response = await request(app)
            .put('/api/categorie/1') // Assurez-vous que l'URL est correcte
            .send({
                name: 'New Electronics',
                description: 'Updated description for devices and gadgets'
            });

        // Vérifications
        expect(response.status).toBe(200);

        // Créer un nouvel objet sans la fonction 'update'
        const { update, ...categoryWithoutUpdate } = mockCategory;

        expect(response.body).toEqual(categoryWithoutUpdate); // Vérifier que la réponse renvoie la catégorie simulée mise à jour

        // Vérifier que Categorie.findByPk a été appelée avec l'ID correct (chaîne de caractères)
        expect(findByPkSpy).toHaveBeenCalledWith("1");

        // Vérifier que la méthode update a été appelée avec les bons paramètres
        expect(mockCategory.update).toHaveBeenCalledWith({
            name: 'New Electronics',
            description: 'Updated description for devices and gadgets'
        });
    });

    it('404 - should return category not found if ID does not exist', async () => {
        // Mock de Categorie.findByPk pour retourner null (catégorie non trouvée)
        const findByPkSpy = jest.spyOn(Categorie, 'findByPk').mockResolvedValue(null);

        // Faire la requête PUT avec un ID qui n'existe pas
        const response = await request(app)
            .put('/api/categorie/999') // Assurez-vous que l'URL est correcte
            .send({
                name: 'Non-existent Category',
                description: 'This category does not exist'
            });

        // Vérifications
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: 'Catégorie non trouvée' });

        // Vérifier que Categorie.findByPk a bien été appelée avec l'ID correct (chaîne de caractères)
        expect(findByPkSpy).toHaveBeenCalledWith("999");
    });

    it('500 - should return internal server error on exception', async () => {
        // Mock de Categorie.findByPk pour lever une erreur
        const findByPkSpy = jest.spyOn(Categorie, 'findByPk').mockRejectedValue(new Error('Erreur lors de la mise à jour'));

        // Faire la requête PUT avec un ID existant
        const response = await request(app)
            .put('/api/categorie/1') // Assurez-vous que l'URL est correcte
            .send({
                name: 'Should not update',
                description: 'Should throw an error'
            });

        // Vérifications
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'Erreur serveur lors de la mise à jour de la catégorie' });

        // Vérifier que Categorie.findByPk a bien été appelée avec l'ID correct (chaîne de caractères)
        expect(findByPkSpy).toHaveBeenCalledWith("1");
    });

});
