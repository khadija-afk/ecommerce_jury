"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _auth = require("../auth.js");

var _reviewController = require("../controllers/review.controller.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router(); // Get all reviews


router.get('/', _reviewController.getAllReviews); // Get review by ID

router.get('/:id', _reviewController.getReviewById); // Create a new review

router.post('/', _auth.verifieToken, _reviewController.createReview); // Update a review

router.put('/:id', _auth.verifieToken, _reviewController.updateReview); // Delete a review

router["delete"]('/:id', _auth.verifieToken, _reviewController.deleteReview);
var _default = router;
exports["default"] = _default;