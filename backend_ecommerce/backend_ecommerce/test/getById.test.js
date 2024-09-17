import { sum } from '../controllers/article.controller';
import SequelizeMock from 'sequelize-mock';

// Créer le modèle mock Article avec SequelizeMock
const DBConnectionMock = new SequelizeMock();
const ArticleMock = DBConnectionMock.define('Article', {
    id: 1,
    title: 'Test Article',
    content: 'This is a test article',
});

jest.mock('../models/index.js', (ArticleMock) => ({
    Article: ArticleMock,
}));

test("test sum", () => {
    expect(sum (4, 5)).toBe(9);
  });