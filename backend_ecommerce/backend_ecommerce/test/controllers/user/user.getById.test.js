import request from 'supertest';
import { app } from 'server.js'; // Assurez-vous que le chemin est correct
import { User } from 'models/index.js'; // Importez votre modèle

describe('GET /api/user/get/:id', () => {

    afterEach(() => {
        jest.restoreAllMocks(); // Restaurer les mocks après chaque test
    });

    it('200 - should return a user by ID', async () => {
        // Mock de User.findById pour retourner un utilisateur simulé
        const mockUser = {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com'
        };

        User.findById = jest.fn().mockResolvedValue(mockUser); // Mock de la fonction

        const response = await request(app).get('/api/user/get/1'); // Assurez-vous que l'URL est correcte
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockUser); // Vérifier que le corps de la réponse contient l'utilisateur simulé

        // Vérifier que findById a bien été appelé avec une chaîne, car req.params.id est une chaîne
        expect(User.findById).toHaveBeenCalledWith("1"); // Utilisez `"1"` pour correspondre à la valeur transmise par l'URL
    });

    it('404 - should return user not found', async () => {
        // Mock de User.findById pour retourner null (utilisateur non trouvé)
        User.findById = jest.fn().mockResolvedValue(null);

        const response = await request(app).get('/api/user/get/999'); // Assurez-vous que l'URL est correcte
        expect(response.status).toBe(404);
        expect(response.body).toEqual("User not found!");

        // Vérifier que findById a bien été appelé avec une chaîne
        expect(User.findById).toHaveBeenCalledWith("999"); // Utilisez `"999"`
    });

    it('500 - should return internal server error', async () => {
        // Mock de User.findById pour lever une erreur
        User.findById = jest.fn().mockRejectedValue(new Error('Erreur de réseau'));

        const response = await request(app).get('/api/user/get/1'); // Assurez-vous que l'URL est correcte
        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            error: "Internal Server Error"
        });

        // Vérifier que findById a bien été appelé avec une chaîne
        expect(User.findById).toHaveBeenCalledWith("1"); // Utilisez `"1"`
    });

});
