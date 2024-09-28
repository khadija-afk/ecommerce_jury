"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkAuth = exports.deleteById = exports.updateById = exports.getById = exports.getAll = exports.register = exports.login = void 0;

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _index = require("../models/index.js");

var _config = require("../config.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var login = function login(req, res) {
  var user, email, comparePassword, token, _user$dataValues, password, other;

  return regeneratorRuntime.async(function login$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          email = req.body.email; // step 1 : get user

          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(_index.User.findOne({
            where: {
              email: email
            }
          }));

        case 4:
          user = _context.sent;
          _context.next = 10;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](1);
          return _context.abrupt("return", res.status(501).json({
            error: "Erreur lors de la recherche de user"
          }));

        case 10:
          if (user) {
            _context.next = 12;
            break;
          }

          return _context.abrupt("return", res.status(404).json("User not found!"));

        case 12:
          _context.next = 14;
          return regeneratorRuntime.awrap(_bcrypt["default"].compare(req.body.password, user.password));

        case 14:
          comparePassword = _context.sent;

          if (comparePassword) {
            _context.next = 17;
            break;
          }

          return _context.abrupt("return", res.status(400).json("Wrong Credentials!"));

        case 17:
          token = _jsonwebtoken["default"].sign({
            id: user.id
          }, _config.env.token, {
            expiresIn: "24h"
          });
          _user$dataValues = user.dataValues, password = _user$dataValues.password, other = _objectWithoutProperties(_user$dataValues, ["password"]);
          res.cookie('access_token', token, {
            httpOnly: true
          }).status(200).json(other);

        case 20:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 7]]);
};

exports.login = login;

var register = function register(req, res) {
  var hashedPassword, user, cart;
  return regeneratorRuntime.async(function register$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(_bcrypt["default"].hash(req.body.password, 10));

        case 3:
          hashedPassword = _context2.sent;
          _context2.next = 6;
          return regeneratorRuntime.awrap(_index.User.create(_objectSpread({}, req.body, {
            password: hashedPassword
          })));

        case 6:
          user = _context2.sent;
          _context2.next = 9;
          return regeneratorRuntime.awrap(_index.Cart.create({
            user_fk: user.id,
            // Lier le panier au nouvel utilisateur
            total_amount: 0 // Initialiser le total du panier à 0

          }));

        case 9:
          cart = _context2.sent;
          res.status(201).json({
            message: "User and Cart have been created!",
            user: user,
            cart: cart // Retourne aussi le panier

          });
          _context2.next = 17;
          break;

        case 13:
          _context2.prev = 13;
          _context2.t0 = _context2["catch"](0);
          console.log(_context2.t0);
          res.status(500).json({
            error: "Internal Server Error",
            mess: _context2.t0.message
          });

        case 17:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

exports.register = register;

var getAll = function getAll(req, res) {
  var users;
  return regeneratorRuntime.async(function getAll$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(_index.User.findAll());

        case 3:
          users = _context3.sent;
          // Utilisation de findAll() au lieu de find()
          res.status(200).json(users);
          _context3.next = 11;
          break;

        case 7:
          _context3.prev = 7;
          _context3.t0 = _context3["catch"](0);
          console.log(_context3.t0);
          res.status(500).json({
            error: "Internal Server Error",
            details: _context3.t0.message
          });

        case 11:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.getAll = getAll;

var getById = function getById(req, res) {
  var id, user;
  return regeneratorRuntime.async(function getById$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          id = req.params.id;
          _context4.next = 4;
          return regeneratorRuntime.awrap(_index.User.findById(id));

        case 4:
          user = _context4.sent;

          if (user) {
            _context4.next = 7;
            break;
          }

          return _context4.abrupt("return", res.status(404).json("User not found!"));

        case 7:
          res.status(200).json(user);
          _context4.next = 14;
          break;

        case 10:
          _context4.prev = 10;
          _context4.t0 = _context4["catch"](0);
          console.log(_context4.t0);
          res.status(500).json({
            error: "Internal Server Error"
          });

        case 14:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

exports.getById = getById;

var updateById = function updateById(req, res) {
  var user;
  return regeneratorRuntime.async(function updateById$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(_index.User.findByPk(req.params.id));

        case 3:
          user = _context5.sent;

          if (user) {
            _context5.next = 6;
            break;
          }

          return _context5.abrupt("return", res.status(404).json({
            message: "User not found!"
          }));

        case 6:
          _context5.next = 8;
          return regeneratorRuntime.awrap(user.update(req.body));

        case 8:
          res.status(200).json({
            message: "User updated",
            user: user
          });
          _context5.next = 15;
          break;

        case 11:
          _context5.prev = 11;
          _context5.t0 = _context5["catch"](0);
          console.log(_context5.t0);
          res.status(500).json({
            error: "Internal Server Error",
            details: _context5.t0.message
          });

        case 15:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 11]]);
};

exports.updateById = updateById;

var deleteById = function deleteById(req, res) {
  var res_destroy;
  return regeneratorRuntime.async(function deleteById$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return regeneratorRuntime.awrap(_index.User.destroy({
            where: {
              id: req.params.id
            }
          }));

        case 3:
          res_destroy = _context6.sent;
          _context6.next = 9;
          break;

        case 6:
          _context6.prev = 6;
          _context6.t0 = _context6["catch"](0);
          return _context6.abrupt("return", res.status(500).json({
            error: "An error occurred while deleting the user",
            details: _context6.t0.message // Détails de l'erreur pour faciliter le débogage

          }));

        case 9:
          if (res_destroy) {
            _context6.next = 11;
            break;
          }

          return _context6.abrupt("return", res.status(404).json({
            message: "User not found!"
          }));

        case 11:
          return _context6.abrupt("return", res.status(200).json({
            message: "User deleted"
          }));

        case 12:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 6]]);
};

exports.deleteById = deleteById;

var checkAuth = function checkAuth(req, res) {
  var token, verified, user, _user$dataValues2, password, other;

  return regeneratorRuntime.async(function checkAuth$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          token = req.cookies.access_token; // Assurez-vous que le token est stocké dans les cookies

          console.log('___auth', token);

          if (token) {
            _context7.next = 5;
            break;
          }

          return _context7.abrupt("return", res.status(401).json({
            message: "Access Denied, No Token Provided!"
          }));

        case 5:
          verified = _jsonwebtoken["default"].verify(token, _config.env.token); // Vérifiez le token avec votre clé secrète

          _context7.next = 8;
          return regeneratorRuntime.awrap(_index.User.findByPk(verified.id));

        case 8:
          user = _context7.sent;

          if (user) {
            _context7.next = 11;
            break;
          }

          return _context7.abrupt("return", res.status(404).json({
            message: "User not found!"
          }));

        case 11:
          _user$dataValues2 = user.dataValues, password = _user$dataValues2.password, other = _objectWithoutProperties(_user$dataValues2, ["password"]); // Évitez d'envoyer le mot de passe dans la réponse

          res.status(200).json(other); // Renvoie les données utilisateur sans le mot de passe

          _context7.next = 19;
          break;

        case 15:
          _context7.prev = 15;
          _context7.t0 = _context7["catch"](0);
          console.log(_context7.t0);
          res.status(500).json({
            error: "Internal Server Error",
            details: _context7.t0.message
          });

        case 19:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 15]]);
};

exports.checkAuth = checkAuth;