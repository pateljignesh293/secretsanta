import express from 'express';
import { authenticate } from '../middleware/auth.js';
import Settings from '../models/Settings.js';

const router = express.Router();

/**
 * @route   GET /api/settings
 * @desc    Get application settings
 * @access  Private
 */
router.get('/', authenticate, async (req, res) => {
    try {
        let settings = await Settings.findOne({ key: 'app-settings' });

        // Create default settings if none exist
        if (!settings) {
            settings = new Settings({
                key: 'app-settings',
                revealDate: new Date(process.env.REVEAL_DATE || '2025-12-25T00:00:00Z'),
                pairingLocked: false,
                revealLocked: true,
                maxParticipants: parseInt(process.env.MAX_PARTICIPANTS) || 30,
            });
            await settings.save();
        }

        res.json({
            revealDate: settings.revealDate,
            pairingLocked: settings.pairingLocked,
            revealLocked: settings.revealLocked,
            maxParticipants: settings.maxParticipants,
            giftSubmissionDeadline: settings.giftSubmissionDeadline,
            pairingGeneratedAt: settings.pairingGeneratedAt,
        });
    } catch (error) {
        console.error('Get settings error:', error);
        res.status(500).json({ error: 'Failed to get settings' });
    }
});

export default router;
