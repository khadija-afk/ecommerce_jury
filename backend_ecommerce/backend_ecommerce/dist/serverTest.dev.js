"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.teardownDatabase = exports.prepareDatabase = void 0;

var _index = require("./models/index.js");

// testServer.js
var prepareDatabase = function prepareDatabase() {
  var user, user2, category;
  return regeneratorRuntime.async(function prepareDatabase$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap((0, _index.initializeDatabase)());

        case 3:
          _context.next = 5;
          return regeneratorRuntime.awrap(_index.User.create({
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            password: 'password123',
            role: 'user'
          }));

        case 5:
          user = _context.sent;
          _context.next = 8;
          return regeneratorRuntime.awrap(_index.User.create({
            firstName: 'John2',
            lastName: 'Doe2',
            email: 'john2.doe2@example.com',
            password: 'password1232',
            role: 'user'
          }));

        case 8:
          user2 = _context.sent;
          _context.next = 11;
          return regeneratorRuntime.awrap(_index.Categorie.create({
            name: 'Test Category',
            description: 'A category for testing'
          }));

        case 11:
          category = _context.sent;
          _context.next = 14;
          return regeneratorRuntime.awrap(_index.Article.create({
            name: 'Test Article',
            content: 'This is a test article',
            brand: 'Test Brand',
            // Fournir une marque
            price: 10.99,
            // Fournir un prix
            stock: 100,
            // Fournir un stock
            user_fk: user.id,
            // Utiliser l'ID de l'utilisateur créé
            categorie_fk: category.id // Utiliser l'ID de la catégorie créée

          }));

        case 14:
          _context.next = 19;
          break;

        case 16:
          _context.prev = 16;
          _context.t0 = _context["catch"](0);
          console.error('Unable to connect to the database or synchronize:', _context.t0);

        case 19:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 16]]);
}; // Fonction pour vider la base de données après les tests


exports.prepareDatabase = prepareDatabase;

var teardownDatabase = function teardownDatabase() {
  return regeneratorRuntime.async(function teardownDatabase$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(_index.Article.destroy({
            where: {},
            truncate: true
          }));

        case 3:
          _context2.next = 5;
          return regeneratorRuntime.awrap(_index.Categorie.destroy({
            where: {},
            truncate: true
          }));

        case 5:
          _context2.next = 7;
          return regeneratorRuntime.awrap(_index.User.destroy({
            where: {},
            truncate: true
          }));

        case 7:
          _context2.next = 12;
          break;

        case 9:
          _context2.prev = 9;
          _context2.t0 = _context2["catch"](0);
          console.error('Error during database teardown:', _context2.t0);

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

exports.teardownDatabase = teardownDatabase;