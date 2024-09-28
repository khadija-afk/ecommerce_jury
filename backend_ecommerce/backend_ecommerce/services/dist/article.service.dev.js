"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get = void 0;

var _index = require("../models/index.js");

var get = function get(id) {
  var article;
  return regeneratorRuntime.async(function get$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(_index.Article.findByPk(id));

        case 3:
          article = _context.sent;
          _context.next = 9;
          break;

        case 6:
          _context.prev = 6;
          _context.t0 = _context["catch"](0);
          throw Object.assign({
            error: 'Error lors de la récupération',
            status: _context.t0.status || 500,
            details: _context.t0.message
          });

        case 9:
          if (article) {
            _context.next = 11;
            break;
          }

          throw Object.assign({
            error: 'Article non trouvé',
            status: 404
          });

        case 11:
          return _context.abrupt("return", article);

        case 12:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 6]]);
};

exports.get = get;