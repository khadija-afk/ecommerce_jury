import express from 'express';
import { getCartByUserId, createCart, updateCartTotalAmount, deleteCart } from '../controllers/cart.controller.js';

const router = express.Router();

// Get cart by user ID
router.get('/:userId', getCartByUserId);

// Create a new cart
router.post('/:userId', createCart);

// Update cart total amount
router.put('/:userId', updateCartTotalAmount);

// Delete a cart
router.delete('/:userId', deleteCart);

export default router;
