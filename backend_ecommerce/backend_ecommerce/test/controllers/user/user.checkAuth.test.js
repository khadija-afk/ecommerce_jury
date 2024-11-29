import request from 'supertest';
import { app } from 'server.js'; // Assurez-vous que le chemin est correct
import { User } from 'src/models/index.js'; // Importez votre modèle
import { prepareDatabase, teardownDatabase, getUserToken } from 'serverTest.js';

describe('GET /api/user/check_auth', () => {
    let user_john;
    let token_invalid;

    beforeAll(async () => {
        await prepareDatabase();
        user_john = await getUserToken('john.doe@example.com');
        token_invalid = await getUserToken('token.invalid@example.com');
    });
    

    afterEach(async () => {
        jest.restoreAllMocks(); // Restaurer les mocks après chaque test
    });

    afterAll(async () => {
        await teardownDatabase();
    });
    
    it('200 - should return user data if token is valid', async () => {
        const mockUser = {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            dataValues: {
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
            }
        };

        User.findByPk = jest.fn().mockResolvedValue(mockUser);

        const response = await request(app)
            .get('/api/user/check_auth')
            .set('Cookie', `access_token=${user_john}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
        });

        expect(User.findByPk).toHaveBeenCalledWith(1, {});
    });

    it('401 - should return access denied if token is missing', async () => {
        const response = await request(app).get('/api/user/check_auth');

        expect(response.status).toBe(401);
        expect(response.body).toEqual({
            message: "Access Denied, No Token Provided!"
        });
    });



    it('404 - should return user not found if user does not exist', async () => {
        User.findByPk = jest.fn().mockResolvedValue(null);

        const response = await request(app)
            .get('/api/user/check_auth')
            .set('Cookie', `access_token=${user_john}`);

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: "Not found" });

        expect(User.findByPk).toHaveBeenCalledWith(1, {});
    });

    it('500 - should return internal server error on exception', async () => {
        User.findByPk = jest.fn().mockRejectedValue(new Error('Erreur lors de la recherche de l\'utilisateur'));

        const response = await request(app)
            .get('/api/user/check_auth')
            .set('Cookie', `access_token=${user_john}`);

        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            error: "Server error while findByPk",
        });

        expect(User.findByPk).toHaveBeenCalledWith(1, {});
    });

    it('500 - should return invalid signature if token is incorrect', async () => {
        const response = await request(app)
            .get('/api/user/check_auth')
            .set('Cookie', `access_token=${token_invalid}`);

        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            error: "Internal Server Error",
            details: "invalid signature"
        });
    });
});
