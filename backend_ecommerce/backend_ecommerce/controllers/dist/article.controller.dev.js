"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getReview = exports.getByUser = exports.getByDesc = exports.getByAsc = exports.deleteById = exports.updateById = exports.getById = exports.getAll = exports.add = void 0;

var _index = require("../models/index.js");

var add = function add(req, res) {
  var _req$body, categorie_fk, name, content, brand, price, stock, photo, user_fk, user, categorie, newArticle;

  return regeneratorRuntime.async(function add$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, categorie_fk = _req$body.categorie_fk, name = _req$body.name, content = _req$body.content, brand = _req$body.brand, price = _req$body.price, stock = _req$body.stock, photo = _req$body.photo;
          user_fk = req.user.id; // Utiliser l'ID de l'utilisateur connecté
          // Vérifier si l'utilisateur existe

          _context.next = 5;
          return regeneratorRuntime.awrap(_index.User.findByPk(user_fk));

        case 5:
          user = _context.sent;

          if (user) {
            _context.next = 8;
            break;
          }

          return _context.abrupt("return", res.status(404).json({
            error: "Utilisateur non trouvé"
          }));

        case 8:
          _context.next = 10;
          return regeneratorRuntime.awrap(_index.Categorie.findByPk(categorie_fk));

        case 10:
          categorie = _context.sent;

          if (categorie) {
            _context.next = 13;
            break;
          }

          return _context.abrupt("return", res.status(404).json({
            error: "Catégorie non trouvée"
          }));

        case 13:
          _context.next = 15;
          return regeneratorRuntime.awrap(_index.Article.create({
            name: name,
            content: content,
            brand: brand,
            price: price,
            stock: stock,
            user_fk: user_fk,
            categorie_fk: categorie_fk,
            photo: photo
          }));

        case 15:
          newArticle = _context.sent;
          // On renvoie le nouvel article avec un statut 201
          res.status(201).json(newArticle);
          _context.next = 23;
          break;

        case 19:
          _context.prev = 19;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0); // Log l'erreur pour le débogage

          res.status(500).json({
            error: 'Erreur lors de la création ! 😭',
            details: _context.t0.message
          });

        case 23:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 19]]);
};

exports.add = add;

var getAll = function getAll(req, res) {
  var articles;
  return regeneratorRuntime.async(function getAll$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(_index.Article.findAll());

        case 3:
          articles = _context2.sent;
          res.status(200).json(articles);
          _context2.next = 10;
          break;

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);
          res.status(500).json({
            error: "Error lors de la récupération"
          });

        case 10:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.getAll = getAll;

var getById = function getById(req, res) {
  var id, article;
  return regeneratorRuntime.async(function getById$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          id = req.params.id;
          _context3.next = 4;
          return regeneratorRuntime.awrap(_index.Article.findByPk(id));

        case 4:
          article = _context3.sent;

          if (article) {
            _context3.next = 7;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            error: "Article non trouvé"
          }));

        case 7:
          res.status(200).json(article);
          _context3.next = 13;
          break;

        case 10:
          _context3.prev = 10;
          _context3.t0 = _context3["catch"](0);
          res.status(500).json({
            error: "Error lors de la récupération"
          });

        case 13:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

exports.getById = getById;

var updateById = function updateById(req, res) {
  var article;
  return regeneratorRuntime.async(function updateById$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(_index.Article.findByPk(req.params.id));

        case 3:
          article = _context4.sent;

          if (article) {
            _context4.next = 6;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            error: "Article non trouvé"
          }));

        case 6:
          if (!(article.user_fk === req.user.id)) {
            _context4.next = 12;
            break;
          }

          _context4.next = 9;
          return regeneratorRuntime.awrap(article.update(req.body));

        case 9:
          return _context4.abrupt("return", res.status(200).json(article));

        case 12:
          return _context4.abrupt("return", res.status(403).json({
            error: "Seul le créateur peut modifier !"
          }));

        case 13:
          _context4.next = 18;
          break;

        case 15:
          _context4.prev = 15;
          _context4.t0 = _context4["catch"](0);
          res.status(500).json({
            error: "Error lors de la récupération"
          });

        case 18:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 15]]);
};

exports.updateById = updateById;

var deleteById = function deleteById(req, res) {
  var article;
  return regeneratorRuntime.async(function deleteById$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(_index.Article.findByPk(req.params.id));

        case 3:
          article = _context5.sent;

          if (article) {
            _context5.next = 6;
            break;
          }

          return _context5.abrupt("return", res.status(404).json({
            error: "Article non trouvé"
          }));

        case 6:
          if (!(article.user_fk === req.user.id)) {
            _context5.next = 12;
            break;
          }

          _context5.next = 9;
          return regeneratorRuntime.awrap(article.destroy());

        case 9:
          res.status(200).json("Article deleted !");
          _context5.next = 13;
          break;

        case 12:
          return _context5.abrupt("return", res.status(403).json({
            error: "Seul le créateur peut supprimer !"
          }));

        case 13:
          _context5.next = 18;
          break;

        case 15:
          _context5.prev = 15;
          _context5.t0 = _context5["catch"](0);
          res.status(500).json({
            error: "Error lors de la suppression"
          });

        case 18:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 15]]);
};

exports.deleteById = deleteById;

var getByAsc = function getByAsc(req, res) {
  var articles;
  return regeneratorRuntime.async(function getByAsc$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return regeneratorRuntime.awrap(_index.Article.findAll({
            order: [["price", 'ASC']]
          }));

        case 3:
          articles = _context6.sent;
          res.status(200).json(articles);
          _context6.next = 10;
          break;

        case 7:
          _context6.prev = 7;
          _context6.t0 = _context6["catch"](0);
          res.status(500).json({
            error: "Erreur lors du tri des articles par prix"
          });

        case 10:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.getByAsc = getByAsc;

var getByDesc = function getByDesc(req, res) {
  var articles;
  return regeneratorRuntime.async(function getByDesc$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _context7.next = 3;
          return regeneratorRuntime.awrap(_index.Article.findAll({
            order: [["price", 'DESC']]
          }));

        case 3:
          articles = _context7.sent;
          res.status(200).json(articles);
          _context7.next = 10;
          break;

        case 7:
          _context7.prev = 7;
          _context7.t0 = _context7["catch"](0);
          res.status(500).json({
            error: "Erreur lors du tri des articles par prix"
          });

        case 10:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.getByDesc = getByDesc;

var getByUser = function getByUser(req, res) {
  var user;
  return regeneratorRuntime.async(function getByUser$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          _context8.next = 3;
          return regeneratorRuntime.awrap(_index.User.findByPk(req.user.id, {
            include: _index.Article
          }));

        case 3:
          user = _context8.sent;

          if (user) {
            _context8.next = 6;
            break;
          }

          return _context8.abrupt("return", res.status(404).json({
            error: "Utilisateur non trouvé"
          }));

        case 6:
          res.status(200).json(user.Articles);
          _context8.next = 13;
          break;

        case 9:
          _context8.prev = 9;
          _context8.t0 = _context8["catch"](0);
          console.log(_context8.t0);
          res.status(500).json({
            error: "Erreur."
          });

        case 13:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

exports.getByUser = getByUser;

var getReview = function getReview(req, res) {
  var article;
  return regeneratorRuntime.async(function getReview$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          _context9.next = 3;
          return regeneratorRuntime.awrap(_index.Article.findByPk(req.params.id, {
            include: "reviews"
          }));

        case 3:
          article = _context9.sent;

          if (article) {
            _context9.next = 6;
            break;
          }

          return _context9.abrupt("return", res.status(404).json({
            error: "Article non trouvé"
          }));

        case 6:
          res.status(200).json(article.reviews);
          _context9.next = 12;
          break;

        case 9:
          _context9.prev = 9;
          _context9.t0 = _context9["catch"](0);
          res.status(500).json({
            error: _context9.t0.message
          });

        case 12:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

exports.getReview = getReview;