"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _orderController = require("../controllers/order.controller.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router(); // Récupérer toutes les commandes


router.get('/', _orderController.getAllOrders); // Récupérer une commande par son ID

router.get('/:id', _orderController.getOrderById); // Créer une nouvelle commande

router.post('/', _orderController.createOrder); // Mettre à jour une commande

router.put('/:id', _orderController.updateOrder); // Supprimer une commande

router["delete"]('/:id', _orderController.deleteOrder);
var _default = router;
exports["default"] = _default;