"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _checkout = _interopRequireDefault(require("../services/checkout.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Importer les modules nécessaires
// Créer un routeur express
var router = _express["default"].Router(); // Définir la route pour créer une session de paiement


router.post("/create-checkout-session", _checkout["default"].createCheckoutSession); // Exporter le routeur pour qu'il puisse être utilisé dans l'application principale

var _default = router;
exports["default"] = _default;