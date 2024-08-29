"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _orderItemController = require("../controllers/orderItem.controller.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router(); // Récupérer tous les articles de commande


router.get('/', _orderItemController.getAllOrderItems); // Récupérer un article de commande par son ID

router.get('/:id', _orderItemController.getOrderItemById); // Créer un nouvel article de commande

router.post('/', _orderItemController.createOrderItem); // Mettre à jour un article de commande

router.put('/:id', _orderItemController.updateOrderItem); // Supprimer un article de commande

router["delete"]('/:id', _orderItemController.deleteOrderItem);
var _default = router;
exports["default"] = _default;