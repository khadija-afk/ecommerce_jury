import request from 'supertest';
import { app } from 'server.js';
import { prepareDatabase, teardownDatabase, getUserToken } from 'serverTest.js';
import { Review } from 'src/models/index.js';

describe('PUT /api/review/:id', () => {
  let userCreator; // Utilisateur ayant créé l'avis
  let userOther;   // Un autre utilisateur

  beforeAll(async () => {
    await prepareDatabase();
    userCreator = await getUserToken('john.doe@example.com');
    userOther = await getUserToken('john2.doe2@example.com');
  });

  afterAll(async () => {
    await teardownDatabase();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('403 - Non autorisé (autre utilisateur)', async () => {

    const response = await request(app)
      .put('/api/review/1')
      .set('Cookie', `access_token=${userOther}`) // Utilisateur non créateur
      .send({
        rating: 3,
        comment: 'Tentative de modification',
      });

    expect(response.status).toBe(403);
    expect(response.body).toEqual({ error: "Vous n'êtes pas autorisé à modifier cet avis." });
  });

  it('200 - Mise à jour réussie par le créateur', async () => {
    
    const response = await request(app)
      .put('/api/review/1')
      .set('Cookie', `access_token=${userCreator}`) // Créateur de l'avis
      .send({
        rating: 5,
        comment: 'Commentaire mis à jour',
      });

    expect(response.status).toBe(200);
    expect(response.body.rating).toBe(5);
    expect(response.body.comment).toBe('Commentaire mis à jour');
    expect(response.body.status).toBe('pending'); // Vérifie que le statut est réinitialisé à "pending"
  });

  it('500 - Erreur serveur', async () => {
    

    jest.spyOn(Review, 'findByPk').mockResolvedValue();

    const response = await request(app)
      .put('/api/review/1')
      .set('Cookie', `access_token=${userCreator}`)
      .send({
        rating: 4,
        comment: 'Erreur de mise à jour',
      });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Erreur serveur lors de la récupération de l'avis." });
  });
});
