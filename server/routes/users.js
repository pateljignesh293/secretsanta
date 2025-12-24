import express from 'express';
import { authenticate } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

/**
 * @route   GET /api/users/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-__v');

        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            department: user.department,
            avatar: user.avatarUrl,
            role: user.role,
            hasLoggedIn: user.hasLoggedIn,
            hasRevealed: user.hasRevealed,
            lastLogin: user.lastLogin,
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Failed to get user profile' });
    }
});

/**
 * @route   PUT /api/users/me
 * @desc    Update current user profile
 * @access  Private
 */
router.put('/me', authenticate, async (req, res) => {
    try {
        const { name, department } = req.body;

        const user = await User.findById(req.user._id);

        if (name) user.name = name;
        if (department !== undefined) user.department = department;

        await user.save();

        res.json({
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                department: user.department,
                avatar: user.avatarUrl,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

/**
 * @route   GET /api/users
 * @desc    Get all users (basic info only)
 * @access  Private
 */
router.get('/', authenticate, async (req, res) => {
    try {
        const users = await User.find({ isActive: true })
            .select('name email department avatar')
            .sort('name');

        const usersData = users.map(user => ({
            id: user._id,
            name: user.name,
            email: user.email,
            department: user.department,
            avatar: user.avatarUrl,
        }));

        res.json({ users: usersData, count: usersData.length });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Failed to get users' });
    }
});

export default router;
