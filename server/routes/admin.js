import express from 'express';
import { authenticate, isAdmin } from '../middleware/auth.js';
import { upload, handleMulterError } from '../middleware/upload.js';
import User from '../models/User.js';
import Pairing from '../models/Pairing.js';
import Gift from '../models/Gift.js';
import Settings from '../models/Settings.js';
import { generatePairings, validatePairings } from '../utils/pairingAlgorithm.js';
import { sendPairingNotification, sendRevealReminder } from '../utils/emailService.js';
import { createObjectCsvWriter } from 'csv-writer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Apply authentication and admin check to all admin routes
router.use(authenticate, isAdmin);

/**
 * @route   GET /api/admin/users
 * @desc    Get all users with full details
 * @access  Admin
 */
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().sort('name');

        const usersData = users.map(user => ({
            id: user._id,
            name: user.name,
            email: user.email,
            department: user.department,
            avatar: user.avatarUrl,
            role: user.role,
            isActive: user.isActive,
            hasLoggedIn: user.hasLoggedIn,
            lastLogin: user.lastLogin,
            hasRevealed: user.hasRevealed,
            revealedAt: user.revealedAt,
            createdAt: user.createdAt,
        }));

        res.json({ users: usersData, count: usersData.length });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Failed to get users' });
    }
});

/**
 * @route   POST /api/admin/users
 * @desc    Create new user
 * @access  Admin
 */
router.post('/users', async (req, res) => {
    try {
        const { name, email, department, role } = req.body;

        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }

        // Check max participants
        const settings = await Settings.findOne({ key: 'app-settings' });
        const userCount = await User.countDocuments({ isActive: true });

        if (userCount >= (settings?.maxParticipants || 30)) {
            return res.status(400).json({ error: 'Maximum participants limit reached' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        const user = new User({
            name,
            email: email.toLowerCase(),
            department: department || '',
            role: role || 'user',
        });

        await user.save();

        res.status(201).json({
            message: 'User created successfully',
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
        console.error('Create user error:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

/**
 * @route   PUT /api/admin/users/:userId
 * @desc    Update user
 * @access  Admin
 */
router.put('/users/:userId', async (req, res) => {
    try {
        const { name, email, department, role, isActive } = req.body;

        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (name) user.name = name;
        if (email) user.email = email.toLowerCase();
        if (department !== undefined) user.department = department;
        if (role) user.role = role;
        if (isActive !== undefined) user.isActive = isActive;

        await user.save();

        res.json({
            message: 'User updated successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                department: user.department,
                avatar: user.avatarUrl,
                role: user.role,
                isActive: user.isActive,
            },
        });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
});

/**
 * @route   DELETE /api/admin/users/:userId
 * @desc    Delete user (soft delete)
 * @access  Admin
 */
router.delete('/users/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.isActive = false;
        await user.save();

        res.json({ message: 'User deactivated successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

/**
 * @route   POST /api/admin/generate-pairings
 * @desc    Generate Secret Santa pairings
 * @access  Admin
 */
router.post('/generate-pairings', async (req, res) => {
    try {
        const settings = await Settings.findOne({ key: 'app-settings' });

        if (settings?.pairingLocked) {
            return res.status(400).json({ error: 'Pairings are already locked. Delete existing pairings first.' });
        }

        // Generate pairings
        const pairings = await generatePairings();

        // Update settings
        if (!settings) {
            await Settings.create({
                key: 'app-settings',
                pairingLocked: true,
                pairingGeneratedAt: new Date(),
            });
        } else {
            settings.pairingLocked = true;
            settings.pairingGeneratedAt = new Date();
            await settings.save();
        }

        // Send notification emails (optional, can be run async)
        try {
            for (const pairing of pairings) {
                const giver = await User.findById(pairing.giver);
                const receiver = await User.findById(pairing.receiver);

                if (giver && receiver) {
                    await sendPairingNotification(giver.email, giver.name, receiver.name);

                    // Mark as notified
                    await Pairing.findByIdAndUpdate(pairing._id, {
                        isNotified: true,
                        notifiedAt: new Date(),
                    });
                }
            }
        } catch (emailError) {
            console.error('Error sending emails:', emailError);
            // Continue even if emails fail
        }

        res.json({
            message: 'Pairings generated successfully',
            count: pairings.length,
            pairings: pairings.map(p => ({
                giver: p.giver,
                receiver: p.receiver,
            })),
        });
    } catch (error) {
        console.error('Generate pairings error:', error);
        res.status(500).json({ error: error.message || 'Failed to generate pairings' });
    }
});

/**
 * @route   GET /api/admin/pairings
 * @desc    Get all pairings
 * @access  Admin
 */
router.get('/pairings', async (req, res) => {
    try {
        const pairings = await Pairing.find()
            .populate('giver', 'name email department')
            .populate('receiver', 'name email department');

        const pairingsData = pairings.map(p => ({
            id: p._id,
            giver: {
                id: p.giver._id,
                name: p.giver.name,
                email: p.giver.email,
                department: p.giver.department,
            },
            receiver: {
                id: p.receiver._id,
                name: p.receiver.name,
                email: p.receiver.email,
                department: p.receiver.department,
            },
            isNotified: p.isNotified,
            notifiedAt: p.notifiedAt,
            createdAt: p.createdAt,
        }));

        res.json({ pairings: pairingsData, count: pairingsData.length });
    } catch (error) {
        console.error('Get pairings error:', error);
        res.status(500).json({ error: 'Failed to get pairings' });
    }
});

/**
 * @route   DELETE /api/admin/pairings
 * @desc    Delete all pairings (reset)
 * @access  Admin
 */
router.delete('/pairings', async (req, res) => {
    try {
        await Pairing.deleteMany({});

        const settings = await Settings.findOne({ key: 'app-settings' });
        if (settings) {
            settings.pairingLocked = false;
            settings.pairingGeneratedAt = null;
            await settings.save();
        }

        res.json({ message: 'All pairings deleted successfully' });
    } catch (error) {
        console.error('Delete pairings error:', error);
        res.status(500).json({ error: 'Failed to delete pairings' });
    }
});

/**
 * @route   GET /api/admin/gifts
 * @desc    Get all submitted gifts
 * @access  Admin
 */
router.get('/gifts', async (req, res) => {
    try {
        const gifts = await Gift.find()
            .populate('giver', 'name email department');

        const giftsData = gifts.map(g => ({
            id: g._id,
            giver: {
                id: g.giver._id,
                name: g.giver.name,
                email: g.giver.email,
                department: g.giver.department,
            },
            giftName: g.giftName,
            message: g.message,
            imageUrl: g.imageUrl,
            submittedAt: g.submittedAt,
        }));

        res.json({ gifts: giftsData, count: giftsData.length });
    } catch (error) {
        console.error('Get gifts error:', error);
        res.status(500).json({ error: 'Failed to get gifts' });
    }
});

/**
 * @route   PUT /api/admin/settings
 * @desc    Update settings
 * @access  Admin
 */
router.put('/settings', async (req, res) => {
    try {
        const { revealDate, revealLocked, giftSubmissionDeadline, maxParticipants } = req.body;

        let settings = await Settings.findOne({ key: 'app-settings' });

        if (!settings) {
            settings = new Settings({ key: 'app-settings' });
        }

        if (revealDate) settings.revealDate = new Date(revealDate);
        if (revealLocked !== undefined) settings.revealLocked = revealLocked;
        if (giftSubmissionDeadline) settings.giftSubmissionDeadline = new Date(giftSubmissionDeadline);
        if (maxParticipants) settings.maxParticipants = maxParticipants;

        await settings.save();

        res.json({
            message: 'Settings updated successfully',
            settings: {
                revealDate: settings.revealDate,
                pairingLocked: settings.pairingLocked,
                revealLocked: settings.revealLocked,
                maxParticipants: settings.maxParticipants,
                giftSubmissionDeadline: settings.giftSubmissionDeadline,
            },
        });
    } catch (error) {
        console.error('Update settings error:', error);
        res.status(500).json({ error: 'Failed to update settings' });
    }
});

/**
 * @route   GET /api/admin/export-pairings
 * @desc    Export pairings as CSV
 * @access  Admin
 */
router.get('/export-pairings', async (req, res) => {
    try {
        const pairings = await Pairing.find()
            .populate('giver', 'name email department')
            .populate('receiver', 'name email department');

        const csvData = pairings.map(p => ({
            giverName: p.giver.name,
            giverEmail: p.giver.email,
            giverDepartment: p.giver.department || 'N/A',
            receiverName: p.receiver.name,
            receiverEmail: p.receiver.email,
            receiverDepartment: p.receiver.department || 'N/A',
            notified: p.isNotified ? 'Yes' : 'No',
            notifiedAt: p.notifiedAt ? p.notifiedAt.toISOString() : 'N/A',
        }));

        // Create CSV
        const csvPath = path.join(__dirname, '../uploads/pairings-export.csv');
        const csvWriter = createObjectCsvWriter({
            path: csvPath,
            header: [
                { id: 'giverName', title: 'Giver Name' },
                { id: 'giverEmail', title: 'Giver Email' },
                { id: 'giverDepartment', title: 'Giver Department' },
                { id: 'receiverName', title: 'Receiver Name' },
                { id: 'receiverEmail', title: 'Receiver Email' },
                { id: 'receiverDepartment', title: 'Receiver Department' },
                { id: 'notified', title: 'Notified' },
                { id: 'notifiedAt', title: 'Notified At' },
            ],
        });

        await csvWriter.writeRecords(csvData);

        res.download(csvPath, 'secret-santa-pairings.csv', (err) => {
            if (err) {
                console.error('Download error:', err);
            }
            // Clean up file after download
            fs.unlink(csvPath, (unlinkErr) => {
                if (unlinkErr) console.error('Error deleting temp file:', unlinkErr);
            });
        });
    } catch (error) {
        console.error('Export pairings error:', error);
        res.status(500).json({ error: 'Failed to export pairings' });
    }
});

/**
 * @route   POST /api/admin/send-reveal-reminders
 * @desc    Send reveal reminder emails to all users
 * @access  Admin
 */
router.post('/send-reveal-reminders', async (req, res) => {
    try {
        const users = await User.find({ isActive: true });

        let successCount = 0;
        let failCount = 0;

        for (const user of users) {
            try {
                await sendRevealReminder(user.email, user.name);
                successCount++;
            } catch (emailError) {
                console.error(`Failed to send to ${user.email}:`, emailError);
                failCount++;
            }
        }

        res.json({
            message: 'Reveal reminders sent',
            success: successCount,
            failed: failCount,
            total: users.length,
        });
    } catch (error) {
        console.error('Send reminders error:', error);
        res.status(500).json({ error: 'Failed to send reminders' });
    }
});

/**
 * @route   GET /api/admin/stats
 * @desc    Get dashboard statistics
 * @access  Admin
 */
router.get('/stats', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ isActive: true });
        const totalPairings = await Pairing.countDocuments();
        const totalGifts = await Gift.countDocuments();
        const revealedCount = await User.countDocuments({ hasRevealed: true });
        const loggedInCount = await User.countDocuments({ hasLoggedIn: true });

        const settings = await Settings.findOne({ key: 'app-settings' });

        res.json({
            totalUsers,
            totalPairings,
            totalGifts,
            revealedCount,
            loggedInCount,
            giftSubmissionRate: totalUsers > 0 ? ((totalGifts / totalUsers) * 100).toFixed(1) : 0,
            revealRate: totalUsers > 0 ? ((revealedCount / totalUsers) * 100).toFixed(1) : 0,
            pairingLocked: settings?.pairingLocked || false,
            revealLocked: settings?.revealLocked || true,
            revealDate: settings?.revealDate,
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ error: 'Failed to get statistics' });
    }
});

export default router;
