import request from 'supertest';
import { app } from 'server.js'; // Assurez-vous que le chemin est correct
import { Categorie } from 'models/index.js'; // Importez votre modèle de catégorie

describe('DELETE /api/categorie/:id', () => {

    afterEach(() => {
        jest.restoreAllMocks(); // Restaurer les mocks après chaque test
    });

    it('200 ', async () => {
        // Catégorie simulée avant suppression
        const mockCategory = {
            id: 1,
            name: 'Old Electronics',
            description: 'Old devices and gadgets',
            destroy: jest.fn() // Simuler la méthode destroy
        };

        // Mock de Categorie.findByPk pour retourner la catégorie simulée
        const findByPkSpy = jest.spyOn(Categorie, 'findByPk').mockResolvedValue(mockCategory);

        // Faire la requête DELETE pour supprimer la catégorie
        const response = await request(app)
            .delete('/api/categorie/1'); // Assurez-vous que l'URL est correcte

        // Vérifications
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: "Categorie deleted" });

        // Vérifier que Categorie.findByPk a été appelée avec l'ID correct (chaîne de caractères)
        expect(findByPkSpy).toHaveBeenCalledWith("1");

        // Vérifier que la méthode destroy a été appelée
        expect(mockCategory.destroy).toHaveBeenCalled();
    });

    it('404 ', async () => {
        // Mock de Categorie.findByPk pour retourner null (catégorie non trouvée)
        const findByPkSpy = jest.spyOn(Categorie, 'findByPk').mockResolvedValue(null);

        // Faire la requête DELETE avec un ID qui n'existe pas
        const response = await request(app)
            .delete('/api/categorie/999'); // Assurez-vous que l'URL est correcte

        // Vérifications
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: 'Catégorie non trouvée' });

        // Vérifier que Categorie.findByPk a bien été appelée avec l'ID correct (chaîne de caractères)
        expect(findByPkSpy).toHaveBeenCalledWith("999");
    });

    it('500 ', async () => {
        // Mock de Categorie.findByPk pour lever une erreur
        const findByPkSpy = jest.spyOn(Categorie, 'findByPk').mockRejectedValue(new Error('Erreur lors de la suppression'));

        // Faire la requête DELETE avec un ID existant
        const response = await request(app)
            .delete('/api/categorie/1'); // Assurez-vous que l'URL est correcte

        // Vérifications
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'Erreur serveur lors de la suppression de la catégorie' });

        // Vérifier que Categorie.findByPk a bien été appelée avec l'ID correct (chaîne de caractères)
        expect(findByPkSpy).toHaveBeenCalledWith("1");
    });

});
