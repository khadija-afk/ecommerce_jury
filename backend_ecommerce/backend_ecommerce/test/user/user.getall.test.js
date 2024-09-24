import request from 'supertest';
import { app } from '../../server.js'; // Assurez-vous que le chemin est correct
import { User } from '../../models/index.js'; // Importez votre modèle

describe('GET /api/user/all', () => {

    afterEach(() => {
        jest.restoreAllMocks(); // Restaurer les mocks après chaque test
    });

    it('200 ', async () => {
        // Mock de User.findAll pour retourner des utilisateurs simulés
        const mockUsers = [
            { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' },
            { id: 2, firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@example.com' }
        ];

        User.findAll = jest.fn().mockResolvedValue(mockUsers); // Mock de la fonction

        const response = await request(app).get('/api/user/all'); // Assurez-vous que l'URL est correcte
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockUsers); // Vérifier que le corps de la réponse contient les utilisateurs simulés

        // Vérifier que findAll a bien été appelé
        expect(User.findAll).toHaveBeenCalled();
    });

    it('500 ', async () => {
        // Mock de User.findAll pour lever une erreur
        User.findAll = jest.fn().mockRejectedValue(new Error('Erreur de réseau'));

        const response = await request(app).get('/api/user/all'); // Assurez-vous que l'URL est correcte
        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            error: "Internal Server Error",
            details: "Erreur de réseau"
        });

        // Vérifier que findAll a bien été appelé
        expect(User.findAll).toHaveBeenCalled();
    });

});
