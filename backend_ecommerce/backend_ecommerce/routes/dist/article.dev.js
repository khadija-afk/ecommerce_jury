"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _auth = require("../auth.js");

var _articleController = require("../controllers/article.controller.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// routes/article.js
var router = _express["default"].Router();

router.post('/', _auth.verifieToken, _articleController.add);
router.get('/', _articleController.getAll);
router.get('/:id', _articleController.getById);
router.put('/:id', _auth.verifieToken, _articleController.updateById);
router["delete"]('/:id', _auth.verifieToken, _articleController.deleteById);
router.get('/sort/asc', _articleController.getByAsc);
router.get('/sort/desc', _articleController.getByDesc);
router.get('/user/articles', _auth.verifieToken, _articleController.getByUser);
router.get('/:id/avis', _articleController.getReview);
var _default = router;
exports["default"] = _default;