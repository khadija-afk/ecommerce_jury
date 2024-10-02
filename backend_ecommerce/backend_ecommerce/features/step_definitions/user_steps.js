import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../server.js';
import { prepareDatabase} from '../../serverTest.js';

await prepareDatabase();
let response;
let userData; // Déclarez userData en dehors du contexte des étapes

Given('I have the following user data:', function (dataTable) {
    // Récupérer les données utilisateur dans une variable globale
    userData = dataTable.rowsHash();
});

When('I send a POST request to {string}', async (route) => {
    response = await request(app).post(route).send(userData); // Utiliser la variable globale userData
});

Then('the response status should be {int}', (statusCode) => {
    expect(response.status).to.equal(statusCode);
});

Then('the response body should contain the user details:', (dataTable) => {
    const expectedUserData = dataTable.rowsHash();
    expect(response.body.user['firstName']).to.equal(expectedUserData['firstName']); // Vérifier dans response.body.user
    expect(response.body.user['email']).to.equal(expectedUserData['email']);
});