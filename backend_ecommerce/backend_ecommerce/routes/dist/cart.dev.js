"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _cartController = require("../controllers/cart.controller.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router(); // Get cart by user ID


router.get('/:userId', _cartController.getCartByUserId); // Create a new cart

router.post('/:userId', _cartController.createCart); // Update cart total amount

router.put('/:userId', _cartController.updateCartTotalAmount); // Delete a cart

router["delete"]('/:userId', _cartController.deleteCart);
var _default = router;
exports["default"] = _default;