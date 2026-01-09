import express from 'express';
import protect from '../middlewares/auth.middleware.js';
import { getMyCart, addToCart, updateCartItem, removeFromCart } from '../controllers/cart.controller.js';

const router = express.Router();

router.get('/my-cart', protect, getMyCart);
router.post('/add', protect, addToCart);
router.put('/update', protect, updateCartItem);
router.delete('/remove/:bookId', protect, removeFromCart);

export default router;