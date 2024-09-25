import request from 'supertest';
import { app } from '../../server.js'; // Assurez-vous que le chemin est correct
import { User } from '../../models/index.js'; // Importez votre modèle

describe('DELETE /api/user/delete/:id', () => {
    afterEach(() => {
        jest.restoreAllMocks(); // Restaurer les mocks après chaque test
    });

    it('200 - should delete a user by ID', async () => {
        // Mock de User.destroy pour simuler la suppression d'un utilisateur
        User.destroy = jest.fn().mockResolvedValue(1); // Simuler qu'un utilisateur a été supprimé (1 signifie succès)

        const response = await request(app).delete('/api/user/delete/1'); // Assurez-vous que l'URL est correcte
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: "User deleted" });

        // Vérifier que destroy a bien été appelé avec l'ID correct
        expect(User.destroy).toHaveBeenCalledWith({ where: { id: "1" } });
    });
  
    it('404 - should return user not found', async () => {
        // Mock de User.destroy pour simuler qu'aucun utilisateur n'a été trouvé
        User.destroy = jest.fn().mockResolvedValue(0); // Simuler qu'aucun utilisateur n'a été supprimé (0 signifie non trouvé)

        const response = await request(app).delete('/api/user/delete/999'); // Assurez-vous que l'URL est correcte
        expect(response.status).toBe(404);
        expect(response.body).toEqual("User not found !");

        // Vérifier que destroy a bien été appelé avec l'ID correct
        expect(User.destroy).toHaveBeenCalledWith({ where: { id: "999" } });
    });

    it('500 - should return internal server error', async () => {
        // Mock de User.destroy pour lever une erreur
        User.destroy = jest.fn().mockRejectedValue(new Error('Erreur de suppression'));
    
        const response = await request(app).delete('/api/user/delete/1'); // Assurez-vous que l'URL est correcte
        expect(response.status).toBe(500);
    
        // Vérifier que destroy a bien été appelé avec l'ID correct
        expect(User.destroy).toHaveBeenCalledWith({ where: { id: "1" } });
    }, 10000); // Augmentez le délai à 10 000 ms (10 secondes)
    
});
