import { Cart } from '../models/index.js';

// Get cart by user ID
export const getCartByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const cart = await Cart.findOne({ where: { user_fk: userId } });
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found for this user' });
        }
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error getting cart:', error);
        res.status(500).json({ error: 'Server error while getting cart' });
    }
};

// Create a new cart
export const createCart = async (req, res) => {
    try {
        const { userId } = req.params;
        const { totalAmount = 0 } = req.body; // Utilise 0 si totalAmount n'est pas fourni
        const newCart = await Cart.create({ user_fk: userId, total_amount: totalAmount });
        res.status(201).json(newCart);
    } catch (error) {
        console.error('Error creating cart:', error);
        res.status(500).json({ error: 'Server error while creating cart', detail: error.message });
    }
};


// Update cart total amount
export const updateCartTotalAmount = async (req, res) => {
    try {
        const { userId } = req.params;
        const { totalAmount } = req.body;
        const cart = await Cart.findOne({ where: { user_fk: userId } });
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found for this user' });
        }
        await cart.update({ total_amount: totalAmount });
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error updating cart total amount:', error);
        res.status(500).json({ error: 'Server error while updating cart total amount' });
    }
};

// Delete a cart
export const deleteCart = async (req, res) => {
    try {
        const { userId } = req.params;
        const cart = await Cart.findOne({ where: { user_fk: userId } });
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found for this user' });
        }
        await cart.destroy();
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting cart:', error);
        res.status(500).json({ error: 'Server error while deleting cart' });
    }
};
