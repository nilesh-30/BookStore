import express from 'express';
import { loginUser, registerUser, logoutUser } from '../controllers/auth.controller.js';

const router = express.Router();

// Register route
router.post('/register', registerUser);
// Login route
router.post('/login', loginUser);
// Logout route
router.post('/logout', logoutUser);

export default router;