import request from 'supertest';
import { app } from '../../server.js'; // Assurez-vous que le chemin est correct
import { Categorie } from '../../models/index.js'; // Importez votre modèle de catégorie

describe('POST /api/categorie', () => {

    afterEach(() => {
        jest.restoreAllMocks(); // Restaurer les mocks après chaque test
    });

    it('201 ', async () => {
        // Données simulées pour la nouvelle catégorie
        const newCategory = {
            id: 1,
            name: 'Electronics',
            description: 'Devices and gadgets'
        };

        // Spy sur Categorie.create pour surveiller les appels et les mocker
        const createSpy = jest.spyOn(Categorie, 'create').mockResolvedValue(newCategory);

        // Faire la requête POST avec des données valides
        const response = await request(app)
            .post('/api/categorie') // Assurez-vous que l'URL est correcte
            .send({
                name: 'Electronics',
                description: 'Devices and gadgets'
            });

        // Assertions
        expect(response.status).toBe(201);
        expect(response.body).toEqual(newCategory);

        // Vérifier que Categorie.create a bien été appelé avec les bons paramètres
        expect(createSpy).toHaveBeenCalledWith({
            name: 'Electronics',
            description: 'Devices and gadgets'
        });
    });

    it('400 ', async () => {
        // Spy sur Categorie.create pour surveiller les appels sans les mocker
        const createSpy = jest.spyOn(Categorie, 'create');

        // Faire la requête POST sans le champ 'name'
        const response = await request(app)
            .post('/api/categorie') // Assurez-vous que l'URL est correcte
            .send({
                description: 'Devices and gadgets'
            });

        // Assertions
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            error: 'Le nom de la catégorie est requis'
        });

        // Vérifier que Categorie.create n'a pas été appelé
        expect(createSpy).not.toHaveBeenCalled();
    });

    it('500 ', async () => {
        // Spy sur Categorie.create pour lever une erreur
        const createSpy = jest.spyOn(Categorie, 'create').mockRejectedValue(new Error('Erreur lors de la création'));

        // Faire la requête POST avec des données valides
        const response = await request(app)
            .post('/api/categorie') // Assurez-vous que l'URL est correcte
            .send({
                name: 'Electronics',
                description: 'Devices and gadgets'
            });

        // Assertions
        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            error: 'Erreur serveur lors de la création de la catégorie'
        });

        // Vérifier que Categorie.create a bien été appelé avec les bons paramètres
        expect(createSpy).toHaveBeenCalledWith({
            name: 'Electronics',
            description: 'Devices and gadgets'
        });
    });

});
