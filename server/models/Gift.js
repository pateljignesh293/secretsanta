import mongoose from 'mongoose';

const giftSchema = new mongoose.Schema({
    giver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true, // Each user can only submit one gift
    },
    giftName: {
        type: String,
        required: [true, 'Gift name is required'],
        trim: true,
    },
    message: {
        type: String,
        required: [true, 'Message is required'],
        trim: true,
        maxlength: [500, 'Message cannot exceed 500 characters'],
    },
    imageUrl: {
        type: String,
        required: [true, 'Gift image is required'],
    },
    imagePublicId: {
        type: String, // For Cloudinary deletion if needed
    },
    submittedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

// Index for faster queries
giftSchema.index({ giver: 1 });

const Gift = mongoose.model('Gift', giftSchema);

export default Gift;
