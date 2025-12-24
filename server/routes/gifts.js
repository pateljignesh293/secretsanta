import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { upload, handleMulterError } from '../middleware/upload.js';
import Gift from '../models/Gift.js';
import Settings from '../models/Settings.js';
import Pairing from '../models/Pairing.js';

const router = express.Router();

/**
 * @route   POST /api/gifts/submit
 * @desc    Submit gift with image and message
 * @access  Private
 */
router.post('/submit', authenticate, upload.single('giftImage'), handleMulterError, async (req, res) => {
    try {
        const { giftName, message } = req.body;

        if (!giftName || !message) {
            return res.status(400).json({ error: 'Gift name and message are required' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'Gift image is required' });
        }

        // Check if settings allow gift submission
        const settings = await Settings.findOne({ key: 'app-settings' });
        if (settings?.giftSubmissionDeadline && new Date() > settings.giftSubmissionDeadline) {
            return res.status(403).json({ error: 'Gift submission deadline has passed' });
        }

        // Check if user has a pairing
        const hasPairing = await Pairing.exists({ giver: req.user._id });
        if (!hasPairing) {
            return res.status(400).json({ error: 'You do not have a Secret Santa assignment yet' });
        }

        // Check if user already submitted a gift
        const existingGift = await Gift.findOne({ giver: req.user._id });

        // Create image URL (relative path from server)
        const imageUrl = `/uploads/gifts/${req.file.filename}`;

        if (existingGift) {
            // Update existing gift
            existingGift.giftName = giftName;
            existingGift.message = message;
            existingGift.imageUrl = imageUrl;
            existingGift.submittedAt = new Date();
            await existingGift.save();

            return res.json({
                message: 'Gift updated successfully',
                gift: {
                    id: existingGift._id,
                    giftName: existingGift.giftName,
                    message: existingGift.message,
                    imageUrl: existingGift.imageUrl,
                    submittedAt: existingGift.submittedAt,
                },
            });
        }

        // Create new gift
        const gift = new Gift({
            giver: req.user._id,
            giftName,
            message,
            imageUrl,
        });

        await gift.save();

        res.status(201).json({
            message: 'Gift submitted successfully',
            gift: {
                id: gift._id,
                giftName: gift.giftName,
                message: gift.message,
                imageUrl: gift.imageUrl,
                submittedAt: gift.submittedAt,
            },
        });
    } catch (error) {
        console.error('Submit gift error:', error);
        res.status(500).json({ error: 'Failed to submit gift' });
    }
});

/**
 * @route   GET /api/gifts/my-gift
 * @desc    Get current user's submitted gift
 * @access  Private
 */
router.get('/my-gift', authenticate, async (req, res) => {
    try {
        const gift = await Gift.findOne({ giver: req.user._id });

        if (!gift) {
            return res.status(404).json({ error: 'No gift submitted yet' });
        }

        res.json({
            gift: {
                id: gift._id,
                giftName: gift.giftName,
                message: gift.message,
                imageUrl: gift.imageUrl,
                submittedAt: gift.submittedAt,
            },
        });
    } catch (error) {
        console.error('Get gift error:', error);
        res.status(500).json({ error: 'Failed to get gift' });
    }
});

/**
 * @route   DELETE /api/gifts/my-gift
 * @desc    Delete current user's gift
 * @access  Private
 */
router.delete('/my-gift', authenticate, async (req, res) => {
    try {
        const settings = await Settings.findOne({ key: 'app-settings' });

        // Check if deadline has passed
        if (settings?.giftSubmissionDeadline && new Date() > settings.giftSubmissionDeadline) {
            return res.status(403).json({ error: 'Cannot delete gift after submission deadline' });
        }

        const gift = await Gift.findOneAndDelete({ giver: req.user._id });

        if (!gift) {
            return res.status(404).json({ error: 'No gift found to delete' });
        }

        res.json({ message: 'Gift deleted successfully' });
    } catch (error) {
        console.error('Delete gift error:', error);
        res.status(500).json({ error: 'Failed to delete gift' });
    }
});

export default router;
