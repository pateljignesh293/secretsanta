import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendMagicLink } from '../utils/emailService.js';

const router = express.Router();

/**
 * @route   POST /api/auth/request-login
 * @desc    Request magic link for login
 * @access  Public
 */
router.post('/request-login', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(404).json({ error: 'User not found. Please contact admin.' });
        }

        if (!user.isActive) {
            return res.status(403).json({ error: 'Account is deactivated.' });
        }

        // Generate magic link token (expires in 1 hour)
        const token = jwt.sign(
            { userId: user._id, email: user.email, type: 'magic-link' },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Send magic link email
        await sendMagicLink(user.email, token, user.name);

        res.json({
            message: 'Magic link sent to your email. Please check your inbox.',
            email: user.email,
        });
    } catch (error) {
        console.error('Request login error:', error);
        res.status(500).json({ error: 'Failed to send magic link' });
    }
});

/**
 * @route   POST /api/auth/verify-token
 * @desc    Verify magic link token and log in user
 * @access  Public
 */
router.post('/verify-token', async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ error: 'Token is required' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.type !== 'magic-link') {
            return res.status(400).json({ error: 'Invalid token type' });
        }

        // Get user
        const user = await User.findById(decoded.userId);

        if (!user || !user.isActive) {
            return res.status(404).json({ error: 'User not found or inactive' });
        }

        // Update login status
        user.hasLoggedIn = true;
        user.lastLogin = new Date();
        await user.save();

        // Generate new JWT for session (expires in 7 days)
        const sessionToken = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            token: sessionToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                department: user.department,
                avatar: user.avatarUrl,
                role: user.role,
                hasLoggedIn: user.hasLoggedIn,
                hasRevealed: user.hasRevealed,
            },
        });
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired. Please request a new login link.' });
        }
        console.error('Verify token error:', error);
        res.status(500).json({ error: 'Authentication failed' });
    }
});

/**
 * @route   POST /api/auth/simulate-otp
 * @desc    Simulate OTP login (for development/demo)
 * @access  Public
 */
router.post('/simulate-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ error: 'Email and OTP are required' });
        }

        // Simple OTP validation (in production, use proper OTP service)
        // For demo: OTP is last 4 digits of timestamp or "1234"
        const validOtp = otp === '1234';

        if (!validOtp) {
            return res.status(401).json({ error: 'Invalid OTP' });
        }

        // Find user
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user || !user.isActive) {
            return res.status(404).json({ error: 'User not found or inactive' });
        }

        // Update login status
        user.hasLoggedIn = true;
        user.lastLogin = new Date();
        await user.save();

        // Generate session token
        const sessionToken = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            token: sessionToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                department: user.department,
                avatar: user.avatarUrl,
                role: user.role,
                hasLoggedIn: user.hasLoggedIn,
                hasRevealed: user.hasRevealed,
            },
        });
    } catch (error) {
        console.error('OTP login error:', error);
        res.status(500).json({ error: 'Authentication failed' });
    }
});

export default router;
