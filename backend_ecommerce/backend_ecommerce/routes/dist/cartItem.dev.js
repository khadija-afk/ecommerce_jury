"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _cartItemController = require("../controllers/cartItem.controller.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router(); // Récupérer tous les articles du panier


router.get('/', _cartItemController.getAllCartItems); // Récupérer un article du panier par son ID

router.get('/:id', _cartItemController.getCartItemById); // Ajouter un nouvel article au panier

router.post('/', _cartItemController.addCartItem); // Mettre à jour un article du panier

router.put('/:id', _cartItemController.updateCartItem); // Supprimer un article du panier

router["delete"]('/:id', _cartItemController.deleteCartItem);
var _default = router;
exports["default"] = _default;