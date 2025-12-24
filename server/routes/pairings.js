import express from 'express';
import { authenticate } from '../middleware/auth.js';
import Pairing from '../models/Pairing.js';
import Gift from '../models/Gift.js';
import User from '../models/User.js';
import Settings from '../models/Settings.js';
import { getUserPairing, getUserSecretSanta } from '../utils/pairingAlgorithm.js';

const router = express.Router();

/**
 * @route   GET /api/pairings/my-assignment
 * @desc    Get current user's Secret Santa assignment (who they give to)
 * @access  Private
 */
router.get('/my-assignment', authenticate, async (req, res) => {
    try {
        const settings = await Settings.findOne({ key: 'app-settings' });

        if (!settings || !settings.pairingLocked) {
            return res.status(400).json({ error: 'Pairings have not been generated yet' });
        }

        const pairing = await getUserPairing(req.user._id);

        if (!pairing) {
            return res.status(404).json({ error: 'No assignment found' });
        }

        res.json({
            assignment: {
                name: pairing.receiver.name,
                email: pairing.receiver.email,
                department: pairing.receiver.department,
                avatar: pairing.receiver.avatar,
            },
            pairingId: pairing._id,
        });
    } catch (error) {
        console.error('Get assignment error:', error);
        res.status(500).json({ error: 'Failed to get assignment' });
    }
});

/**
 * @route   GET /api/pairings/reveal
 * @desc    Reveal Secret Santa (who is giving to current user)
 * @access  Private
 */
router.get('/reveal', authenticate, async (req, res) => {
    try {
        const settings = await Settings.findOne({ key: 'app-settings' });

        // Check if reveal is unlocked
        if (!settings || settings.revealLocked) {
            const revealDate = settings?.revealDate || new Date();
            return res.status(403).json({
                error: 'Reveal is locked',
                revealDate,
                message: 'The reveal is not yet available. Please wait until the reveal date.',
            });
        }

        // Check if user has already revealed
        if (req.user.hasRevealed) {
            // Still return the data if already revealed
            const secretSanta = await getUserSecretSanta(req.user._id);
            if (!secretSanta) {
                return res.status(404).json({ error: 'No Secret Santa found' });
            }

            // Get the gift
            const gift = await Gift.findOne({ giver: secretSanta.giver._id });

            return res.json({
                alreadyRevealed: true,
                revealedAt: req.user.revealedAt,
                secretSanta: {
                    name: secretSanta.giver.name,
                    email: secretSanta.giver.email,
                    department: secretSanta.giver.department,
                    avatar: secretSanta.giver.avatar,
                },
                gift: gift ? {
                    name: gift.giftName,
                    message: gift.message,
                    image: gift.imageUrl,
                    submittedAt: gift.submittedAt,
                } : null,
            });
        }

        // Get Secret Santa pairing
        const secretSanta = await getUserSecretSanta(req.user._id);

        if (!secretSanta) {
            return res.status(404).json({ error: 'No Secret Santa found' });
        }

        // Get the gift
        const gift = await Gift.findOne({ giver: secretSanta.giver._id });

        // Mark user as revealed
        req.user.hasRevealed = true;
        req.user.revealedAt = new Date();
        await req.user.save();

        res.json({
            alreadyRevealed: false,
            secretSanta: {
                name: secretSanta.giver.name,
                email: secretSanta.giver.email,
                department: secretSanta.giver.department,
                avatar: secretSanta.giver.avatar,
            },
            gift: gift ? {
                name: gift.giftName,
                message: gift.message,
                image: gift.imageUrl,
                submittedAt: gift.submittedAt,
            } : null,
        });
    } catch (error) {
        console.error('Reveal error:', error);
        res.status(500).json({ error: 'Failed to reveal Secret Santa' });
    }
});

/**
 * @route   GET /api/pairings/status
 * @desc    Get pairing status for current user
 * @access  Private
 */
router.get('/status', authenticate, async (req, res) => {
    try {
        const settings = await Settings.findOne({ key: 'app-settings' });
        const hasPairing = await Pairing.exists({ giver: req.user._id });
        const hasGift = await Gift.exists({ giver: req.user._id });

        res.json({
            pairingLocked: settings?.pairingLocked || false,
            revealLocked: settings?.revealLocked || true,
            revealDate: settings?.revealDate,
            hasPairing: !!hasPairing,
            hasSubmittedGift: !!hasGift,
            hasRevealed: req.user.hasRevealed,
        });
    } catch (error) {
        console.error('Get status error:', error);
        res.status(500).json({ error: 'Failed to get status' });
    }
});

export default router;
