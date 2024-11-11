import request from 'supertest';
import { app } from 'server.js';
import { prepareDatabase, teardownDatabase } from 'serverTest.js';
import { User, Cart } from 'src/models/index.js';

describe('POST /api/user/add', () => {
    let mockUser, mockCart;

    beforeAll(async () => {
        await prepareDatabase();
    });

    afterAll(async () => {
        await teardownDatabase();
    });

    afterEach(async () => {
        jest.restoreAllMocks(); // Restaurer les mocks après chaque test
    });

    it('201 - Created successfully', async () => {
        mockUser = {
            id: 1,
            email: "lafnech@gmail.com",
            firstName: "John",
            lastName: "Doe",
            password: "$2b$10$IhUnpwV/GCHV9U/V4lElKOD6FqZkuYUkBjvbL7hfeu3uIJlmBp4Ji",
            role: 'user',
            dataValues: {
                id: 1,
                email: "lafnech@gmail.com",
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

        User.create = jest.fn().mockResolvedValue(mockUser);
        Cart.create = jest.fn().mockResolvedValue(mockCart);

        const response = await request(app)
            .post('/api/user/add')
            .send({
                email: "lafnech@gmail.com",
                firstName: "John",
                lastName: "Doe",
                password: "khadija1234@Kenzi"
            });

        // Vérifier le résultat attendu
        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            user: mockUser,
            cart: mockCart,
            message: "Utilisateur créé avec succès et email de bienvenue envoyé."
        });

        // Vérifier que User.create et Cart.create ont été appelés
        expect(User.create).toHaveBeenCalledWith({
            email: "lafnech@gmail.com",
            firstName: "John",
            lastName: "Doe",
            password: expect.any(String)
        });
        expect(Cart.create).toHaveBeenCalledWith({
            user_fk: mockUser.id,
            total_amount: 0
        });
    });

    it('500 - Server error when creating user', async () => {
        User.create = jest.fn().mockRejectedValue(new Error('Erreur lors de la création de l\'utilisateur'));

        const response = await request(app)
            .post('/api/user/add')
            .send({
                email: "lafnech@gmail.com",
                firstName: "John",
                lastName: "Doe",
                password: "Doe1234?@KENZI"
            });

        // Vérifier que le serveur renvoie une erreur 500
        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            error: "Erreur serveur lors de l'inscription."
        });
    });
});
