import request from 'supertest';
import { prepareDatabase, teardownDatabase, getUserToken } from 'serverTest.js';
import { app } from 'server.js';

describe('PUT /api/article/:id', () => {
  let user_john;

  beforeAll(async () => {
    await prepareDatabase();
    user_john = await getUserToken('john.doe@example.com'); // Obtenir un token valide pour `john`
  });

  afterAll(async () => {
    await teardownDatabase();
  });

  afterEach(() => {
    jest.restoreAllMocks(); // Restaurer les mocks après chaque test
  });

  it('401 - Utilisateur non authentifié', async () => {
    const response = await request(app)
      .put('/api/article/1')
      .send({ name: 'Updated Article Name' }); // Aucune authentification envoyée

    expect(response.status).toBe(401); // Vérifier que le statut est 401
    expect(response.body).toEqual({ error: 'Non authentifié' }); // Vérifier que le message d'erreur est conforme
  });
});
