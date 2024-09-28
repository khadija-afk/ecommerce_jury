import request from 'supertest';
import { app } from '../../../server.js';
import { prepareDatabase, teardownDatabase, getUserToken } from '../../../serverTest.js';


describe('POST /api/user/sign', () => {
    let user_john;
    let fake_user;

    beforeAll(async () => {
        await prepareDatabase();
        user_john = await getUserToken('john.doe@example.com');
        fake_user = await getUserToken('fake@example.com');
    });
    
    afterAll(async () => {
        await teardownDatabase();
    });

    afterEach(() => {
        jest.restoreAllMocks(); // Restaurer les mocks après chaque test
    });

    
    
    it('404', async () => {

        const response = await request(app)
            .post('/api/user/sign')
            .send({
                email: 'fake@example.com',
            });
        expect(response.status).toBe(404);
    });

    it('501', async () => {
        const { User } = require('../../../models/index.js');
        
        // Mock de Article.findByPk pour retourner l'instance mockée
        User.findOne = jest.fn().mockRejectedValue(new Error('Erreur de Réseau'));
    
        // Exécuter la requête de suppression
        const response = await request(app)
                        .post('/api/user/sign')
                        .send({
                            email: 'fake@example.com',
                        });
        // Vérifier le résultat attendu
        expect(response.status).toBe(501);
        expect(response.body).toEqual({ error: "Erreur lors de la recherche de user" });
    
        // Vérifier que findOne a bien été appelé
        expect(User.findOne).toHaveBeenCalled();
        // Restaurer le mock
        User.findOne.mockRestore();
    });

    it('400', async () => {
        const { User } = require('../../../models/index.js');
        
        // Simuler une instance d'article avec une méthode destroy qui lève une erreur
        const mockUser = {
            email: "john.doe@example.com",
            password: "136"
        };
    
        // Mock de Article.findByPk pour retourner l'instance mockée
        User.findOne = jest.fn().mockResolvedValue(mockUser);

        const response = await request(app)
                        .post('/api/user/sign')
                        .send({
                            password: "123",
                            email: 'john.doe@example.com',
                        });
        // Vérifier le résultat attendu
        expect(response.status).toBe(400);
        expect(response.body).toEqual("Wrong Credentials!");

    });
    
    it('200', async () => {
        const { User } = require('../../../models/index.js');
        
        // Simuler une instance d'article avec une méthode destroy qui lève une erreur
        const mockUser = {
            id: 4,
            password: "$2b$10$IhUnpwV/GCHV9U/V4lElKOD6FqZkuYUkBjvbL7hfeu3uIJlmBp4Ji",
            email: "john.doe@example.com",
            firstName: 'John',
            lastName: 'Doe',
            role: 'user',
            dataValues: {
                id: 4,
                password: "$2b$10$IhUnpwV/GCHV9U/V4lElKOD6FqZkuYUkBjvbL7hfeu3uIJlmBp4Ji",
                email: "john.doe@example.com",
                firstName: 'John',
                lastName: 'Doe',
                role: 'user'
            }
        };
    
        // Mock de Article.findByPk pour retourner l'instance mockée
        User.findOne = jest.fn().mockResolvedValue(mockUser);
        User.dataValues = jest.fn().mockResolvedValue(mockUser);

        const response = await request(app)
                        .post('/api/user/sign')
                        .send({
                            password: "123",
                            email: 'john.doe@example.com',
                        });
        // Vérifier le résultat attendu
        expect(response.status).toBe(200);
        expect(response.body).toEqual({"email": "john.doe@example.com", "firstName": "John", "id": 4, "lastName": "Doe", "role": "user"});

    });

})