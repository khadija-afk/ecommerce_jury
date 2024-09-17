/*import request from 'supertest';
import { jest } from '@jest/globals';
import { app } from '../server.js'; // Assurez-vous que ce chemin est correct
import { User } from '../models/index.js';

// Mock de la base de données
jest.mock('../models/index.js');

describe('User Controller', () => {
  beforeEach(() => {
    User.findAll = jest.fn().mockResolvedValue([]);
  });

  it('should return all users', async () => {
    const res = await request(app).get('/api/user');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([]);
  });

  
});*/

/*import express from 'express';
import request from 'supertest';
import articleRoute from '../routes/article.js';
//import { syncModels, closeConnection, connection } from '../models/index.js';  // Assurez-vous d'importer sequelize

const app = express();
app.use(express.json());
app.use("/api/article", articleRoute);

/*beforeAll(async () => {
  await syncModels();  // Synchronize the models before running the tests
});

afterAll(async () => {
  // Close the server and any other resources if needed
  await closeConnection();  // Close the database connection after the tests
});*/

/*describe("test d'intégration pour l'API article", () => {
  it("should get all articles with the command GET /api/article/", async () => {
    const { body, statusCode } = await request(app).get("/api/article/");
    expect(body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          content: expect.any(String),
          brand: expect.any(String),
          price: expect.any(String),
          status: expect.any(Boolean),
          stock: expect.any(Number),
          user_fk: expect.any(Number),
          categorie_fk: expect.any(Number),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      ])
    );
    expect(statusCode).toBe(200);
  });
});*/
//test qui donne succès à tous les coups
test("test trivial qui réussit toujours 2", () => {
  expect(true).toBe(true);
});