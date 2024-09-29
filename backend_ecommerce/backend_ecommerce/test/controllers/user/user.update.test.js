import request from 'supertest';
import { app } from '../../../server.js'; // Assurez-vous que le chemin est correct
import { User } from '../../../models/index.js'; // Importez votre modèle

describe('PUT /api/user/update/:id', () => {

    afterEach(() => {
        jest.restoreAllMocks(); // Restaurer les mocks après chaque test
    });

    it('200 - should update a user by ID', async () => {
        // Mock de User.findByPk pour retourner un utilisateur simulé
        const mockUser = {
            id: 30,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            update: jest.fn().mockResolvedValue(true), // Simulez la mise à jour réussie
        };
    
        User.findByPk = jest.fn().mockResolvedValue(mockUser); // Mock de la fonction
    
        const response = await request(app)
            .put('/api/user/update/30') // Assurez-vous que l'URL est correcte
            .send({
                firstName: 'Jane',
                lastName: 'Smith',
            }); // Simuler une mise à jour des données utilisateur
    
        expect(response.status).toBe(200);
    
        // Créer un nouvel objet sans la fonction `update`
        const { update, ...userWithoutUpdate } = mockUser; 
    
        expect(response.body).toEqual({
            message: "User updated",
            user: userWithoutUpdate, // Comparer l'utilisateur sans la méthode `update`
        });
    
        // Vérifier que findByPk a bien été appelé avec la bonne valeur
        expect(User.findByPk).toHaveBeenCalledWith("30");
    
        // Vérifier que la méthode update a bien été appelée avec les nouvelles données
        expect(mockUser.update).toHaveBeenCalledWith({
            firstName: 'Jane',
            lastName: 'Smith',
        });
    });
    
    it('404 - should return user not found', async () => {
        // Mock de User.findByPk pour retourner null (utilisateur non trouvé)
        User.findByPk = jest.fn().mockResolvedValue(null);

        const response = await request(app)
            .put('/api/user/update/999') // Assurez-vous que l'URL est correcte
            .send({
                firstName: 'Jane',
                lastName: 'Smith',
            });

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: "User non trouvé" });

        // Vérifier que findByPk a bien été appelé avec la bonne valeur
        expect(User.findByPk).toHaveBeenCalledWith("999");
    });

    it('500 - should return internal server error', async () => {
        // Mock de User.findByPk pour lever une erreur
        User.findByPk = jest.fn().mockRejectedValue(new Error('Erreur de réseau'));

        const response = await request(app)
            .put('/api/user/update/30') // Assurez-vous que l'URL est correcte
            .send({
                firstName: 'Jane',
                lastName: 'Smith',
            });

        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            error: "Error lors de la récupération",
        });

        // Vérifier que findByPk a bien été appelé avec la bonne valeur
        expect(User.findByPk).toHaveBeenCalledWith("30");
    });

});
