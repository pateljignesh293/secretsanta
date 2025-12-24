import mongoose from 'mongoose';

const pairingSchema = new mongoose.Schema({
    giver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    isNotified: {
        type: Boolean,
        default: false,
    },
    notifiedAt: {
        type: Date,
    },
}, {
    timestamps: true,
});

// Ensure unique pairings
pairingSchema.index({ giver: 1 }, { unique: true });
pairingSchema.index({ receiver: 1 });

// Validation to prevent self-pairing
pairingSchema.pre('save', function (next) {
    if (this.giver.equals(this.receiver)) {
        next(new Error('User cannot be paired with themselves'));
    }
    next();
});

const Pairing = mongoose.model('Pairing', pairingSchema);

export default Pairing;
