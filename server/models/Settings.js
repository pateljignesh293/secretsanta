import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true,
        enum: ['app-settings'], // Only one settings document
    },
    revealDate: {
        type: Date,
        required: true,
        default: () => new Date(process.env.REVEAL_DATE || '2025-12-25T00:00:00Z'),
    },
    pairingLocked: {
        type: Boolean,
        default: false,
    },
    revealLocked: {
        type: Boolean,
        default: true, // Locked until reveal date
    },
    pairingGeneratedAt: {
        type: Date,
    },
    maxParticipants: {
        type: Number,
        default: 30,
    },
    giftSubmissionDeadline: {
        type: Date,
    },
}, {
    timestamps: true,
});

const Settings = mongoose.model('Settings', settingsSchema);

export default Settings;
