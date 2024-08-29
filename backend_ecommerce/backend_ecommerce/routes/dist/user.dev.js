"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _userController = require("../controllers/user.controller.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router();

router.post("/sign", _userController.login);
router.post("/add", _userController.register); // Route pour obtenir tous les utilisateurs

router.get("/all", _userController.getAll); // Route pour obtenir un utilisateur spécifique par son ID

router.get("/get/:id", _userController.getById); // Route pour mettre à jour un utilisateur spécifique par son ID

router.put("/update/:id", _userController.updateById); // Route pour supprimer un utilisateur spécifique par son ID

router["delete"]("/delete/:id", _userController.deleteById);
var _default = router;
exports["default"] = _default;