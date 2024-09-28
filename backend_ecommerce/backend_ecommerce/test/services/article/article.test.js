import { prepareDatabase, teardownDatabase} from '../../../serverTest.js';

import * as articleService from '../../../services/article.service.js'

import { Article } from '../../../models/index.js';

describe('get', () => {

    beforeAll(async () => {
        await prepareDatabase();
    });
    
    afterAll(async () => {
        await teardownDatabase();
    });

    afterEach(() => {
        jest.restoreAllMocks(); // Restaurer les mocks après chaque test
    });

    it('404 ', async () => {
        await expect(articleService.get(99)).rejects.toEqual({
            error: 'Article non trouvé',
            status: 404,
          });
    })

    it('500 ', async () => {
        jest.spyOn(Article, 'findByPk').mockRejectedValueOnce(new Error('Erreur interne'));

        await expect(articleService.get(99)).rejects.toEqual({
            error: 'Error lors de la récupération',
            details: 'Erreur interne',
            status: 500,
          });
    })
});
