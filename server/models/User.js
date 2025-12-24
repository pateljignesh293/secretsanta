import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    department: {
        type: String,
        trim: true,
        default: '',
    },
    avatar: {
        type: String,
        default: 'https://ui-avatars.com/api/?background=random',
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    hasLoggedIn: {
        type: Boolean,
        default: false,
    },
    lastLogin: {
        type: Date,
    },
    hasRevealed: {
        type: Boolean,
        default: false,
    },
    revealedAt: {
        type: Date,
    },
}, {
    timestamps: true,
});

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

// Virtual for avatar URL with name
userSchema.virtual('avatarUrl').get(function () {
    if (this.avatar && this.avatar.startsWith('http')) {
        return this.avatar;
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(this.name)}&background=random&color=fff&size=200`;
});

// Ensure virtuals are included in JSON
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

const User = mongoose.model('User', userSchema);

export default User;
