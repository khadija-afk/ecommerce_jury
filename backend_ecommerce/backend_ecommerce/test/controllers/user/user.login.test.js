import request from 'supertest';
import { app } from 'server.js';
import { prepareDatabase, teardownDatabase, getUserToken } from 'serverTest.js';


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
                .send({ email: 'fake@example.com' });
            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: "Email et mot de passe sont requis." });
        });
    
        it('501', async () => {
            const { User } = require('src/models/index.js');
            User.findOne = jest.fn().mockRejectedValue(new Error('Erreur de Réseau'));
    
            const response = await request(app)
                .post('/api/user/sign')
                .send({ email: 'fake@example.com' });
    
            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: "Email et mot de passe sont requis." });
    
            User.findOne.mockRestore();
        });
    
        it('400', async () => {
            const { User } = require('src/models/index.js');
            const mockUser = { email: "john.doe@example.com", password: "136" };
    
            User.findOne = jest.fn().mockResolvedValue(mockUser);
    
            const response = await request(app)
                .post('/api/user/sign')
                .send({ email: 'john.doe@example.com', password: "123" });
    
            expect(response.status).toBe(400);
            expect(response.body).toEqual({ details: "Le mot de passe est invalide.", error: "Identifiants incorrects." });
        });
    
        // it('200', async () => {
        //     const { User } = require('src/models/index.js');
        //     const mockUser = {
        //         id: 4,
        //         password: "$2b$10$IhUnpwV/GCHV9U/V4lElKOD6FqZkuYUkBjvbL7hfeu3uIJlmBp4Ji",
        //         email: "john.doe@example.com",
        //         firstName: 'John',
        //         lastName: 'Doe',
        //         role: 'user',
        //     };
    
        //     User.findOne = jest.fn().mockResolvedValue(mockUser);
    
        //     const response = await request(app)
        //         .post('/api/user/sign')
        //         .send({ email: 'john.doe@example.com', password: "123" });
    
        //     expect(response.status).toBe(200);
        //     expect(response.body).toEqual({
        //         message: "Connexion réussie.",
        //         token: expect.any(String),
        //         user: {
        //             email: "john.doe@example.com",
        //             firstName: "John",
        //             id: 4,
        //             lastName: "Doe",
        //             role: "user"
        //         }
        //     });
        // });
    });
    