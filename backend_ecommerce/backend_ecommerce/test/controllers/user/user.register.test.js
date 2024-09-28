import request from 'supertest';
import { app } from '../../../server.js';
import { prepareDatabase, teardownDatabase } from '../../../serverTest.js';

describe('POST /api/user/add', () => {
    let mockUser, mockCart;

    beforeAll(async () => {
        await prepareDatabase();
    });

    afterAll(async () => {
        await teardownDatabase();
    });

    afterEach(() => {
        jest.restoreAllMocks(); // Restaurer les mocks après chaque test
    });

    it('201 created successfully', async () => {
        const { User, Cart } = require('../../../models/index.js');

        // Simuler une instance de User et Cart avec des valeurs mockées
        mockUser = {
            id: 1,
            email: "john.doe@example.com",
            firstName: "John",
            lastName: "Doe",
            password: "$2b$10$IhUnpwV/GCHV9U/V4lElKOD6FqZkuYUkBjvbL7hfeu3uIJlmBp4Ji", // hashed password
            role: 'user',
            dataValues: {
                id: 1,
                email: "john.doe@example.com",
                firstName: "John",
                lastName: "Doe",
                role: 'user'
            }
        };

        mockCart = {
            id: 1,
            user_fk: mockUser.id,
            total_amount: 0
        };

        // Mock de User.create pour retourner l'utilisateur simulé
        User.create = jest.fn().mockResolvedValue(mockUser);

        // Mock de Cart.create pour retourner un panier simulé
        Cart.create = jest.fn().mockResolvedValue(mockCart);

        const response = await request(app)
            .post('/api/user/add')
            .send({
                email: "john.doe@example.com",
                firstName: "John",
                lastName: "Doe",
                password: "123456" // un mot de passe non hashé
            });

        // Vérifier le résultat attendu
        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            message: "User and Cart have been created!",
            user: mockUser,
            cart: mockCart
        });

        // Vérifier que User.create et Cart.create ont été appelés
        expect(User.create).toHaveBeenCalledWith({
            email: "john.doe@example.com",
            firstName: "John",
            lastName: "Doe",
            password: expect.any(String) // le mot de passe doit être hashé
        });
        expect(Cart.create).toHaveBeenCalledWith({
            user_fk: mockUser.id,
            total_amount: 0
        });
    });

    it('500 ', async () => {
        const { User } = require('../../../models/index.js');

        // Simuler une erreur lors de la création de l'utilisateur
        User.create = jest.fn().mockRejectedValue(new Error('Erreur lors de la création de l\'utilisateur'));

        const response = await request(app)
            .post('/api/user/add')
            .send({
                email: "john.doe@example.com",
                firstName: "John",
                lastName: "Doe",
                password: "123456"
            });

        // Vérifier que le serveur renvoie une erreur 500
        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            error: "Internal Server Error",
            mess: "Erreur lors de la création de l'utilisateur"
        });
    });
});
