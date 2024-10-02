// import { prepareDatabase, teardownDatabase} from 'serverTest.js';

// import * as Service from 'services/service.js'

// import { Article } from 'models/index.js';

// describe('get', () => {

//     beforeAll(async () => {
//         await prepareDatabase();
//     });
    
//     afterAll(async () => {
//         await teardownDatabase();
//     });

//     afterEach(() => {
//         jest.restoreAllMocks(); // Restaurer les mocks après chaque test
//     });

//     it('404 ', async () => {
//         await expect(Service.get(99)).rejects.toEqual({
//             error: 'Not found',
//             status: 404,
//           });
//     })

//     it('500 ', async () => {
//         jest.spyOn(Article, 'findByPk').mockRejectedValueOnce(new Error('Erreur interne'));

//         await expect(Service.get(99)).rejects.toEqual({
//             error: 'Server error while findByPk',
//             details: 'Erreur interne',
//             status: 500,
//           });
//     })
// });
