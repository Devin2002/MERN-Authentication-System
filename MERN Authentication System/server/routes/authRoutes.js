import express from 'express';
import { register, login, logout, sendVerifyOtp, verifyEmail, isAuthenticated, sendResetOtp, resetPassword } from '../controllers/authController.js';
import userAuth from '../middleware/userAuth.js';

const authRoutes = express.Router();

authRoutes.post('/register', register);
authRoutes.post('/login', login);
authRoutes.post('/logout', logout);
authRoutes.post('/send-verify-otp', userAuth, sendVerifyOtp);
authRoutes.post('/verify-account', userAuth, verifyEmail);
authRoutes.post('/is-auth', userAuth, isAuthenticated);
authRoutes.post('/send-reset-otp', sendResetOtp);
authRoutes.post('/reset-password', resetPassword);

export default authRoutes;   
