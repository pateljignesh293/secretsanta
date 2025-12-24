import User from '../models/User.js';
import Pairing from '../models/Pairing.js';

/**
 * Fisher-Yates shuffle algorithm
 */
const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

/**
 * Generate Secret Santa pairings with circular distribution
 * Ensures no one gets themselves and creates a complete cycle
 */
export const generatePairings = async () => {
    try {
        // Get all active users
        const users = await User.find({ isActive: true });

        if (users.length < 3) {
            throw new Error('At least 3 participants required for Secret Santa');
        }

        // Check if pairings already exist
        const existingPairings = await Pairing.countDocuments();
        if (existingPairings > 0) {
            throw new Error('Pairings already exist. Delete existing pairings first.');
        }

        // Shuffle users to randomize
        const shuffledUsers = shuffleArray(users);

        // Create circular pairings (each person gives to the next in the shuffled array)
        const pairings = [];
        for (let i = 0; i < shuffledUsers.length; i++) {
            const giver = shuffledUsers[i];
            const receiver = shuffledUsers[(i + 1) % shuffledUsers.length]; // Circular

            pairings.push({
                giver: giver._id,
                receiver: receiver._id,
            });
        }

        // Verify no self-pairings (shouldn't happen with circular, but double-check)
        const hasSelfPairing = pairings.some(p => p.giver.equals(p.receiver));
        if (hasSelfPairing) {
            throw new Error('Invalid pairing detected: self-pairing found');
        }

        // Save all pairings
        await Pairing.insertMany(pairings);

        console.log(`✅ Generated ${pairings.length} Secret Santa pairings`);
        return pairings;
    } catch (error) {
        console.error('❌ Error generating pairings:', error);
        throw error;
    }
};

/**
 * Get pairing for a specific user (who they should give a gift to)
 */
export const getUserPairing = async (userId) => {
    try {
        const pairing = await Pairing.findOne({ giver: userId })
            .populate('receiver', 'name email department avatar');

        if (!pairing) {
            return null;
        }

        return pairing;
    } catch (error) {
        console.error('❌ Error getting user pairing:', error);
        throw error;
    }
};

/**
 * Get who is giving to a specific user (their Secret Santa)
 */
export const getUserSecretSanta = async (userId) => {
    try {
        const pairing = await Pairing.findOne({ receiver: userId })
            .populate('giver', 'name email department avatar');

        if (!pairing) {
            return null;
        }

        return pairing;
    } catch (error) {
        console.error('❌ Error getting Secret Santa:', error);
        throw error;
    }
};

/**
 * Validate pairings integrity
 */
export const validatePairings = async () => {
    try {
        const pairings = await Pairing.find();
        const users = await User.find({ isActive: true });

        // Check if everyone has exactly one pairing
        const giverCount = {};
        const receiverCount = {};

        pairings.forEach(pairing => {
            const giverId = pairing.giver.toString();
            const receiverId = pairing.receiver.toString();

            giverCount[giverId] = (giverCount[giverId] || 0) + 1;
            receiverCount[receiverId] = (receiverCount[receiverId] || 0) + 1;
        });

        // Validate counts
        for (const user of users) {
            const userId = user._id.toString();
            if (giverCount[userId] !== 1) {
                return { valid: false, error: `User ${user.name} has ${giverCount[userId] || 0} giving assignments` };
            }
            if (receiverCount[userId] !== 1) {
                return { valid: false, error: `User ${user.name} has ${receiverCount[userId] || 0} receiving assignments` };
            }
        }

        return { valid: true };
    } catch (error) {
        console.error('❌ Error validating pairings:', error);
        throw error;
    }
};
