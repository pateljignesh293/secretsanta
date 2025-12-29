import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Settings from './server/models/Settings.js';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const unlockReveal = async () => {
    try {
        console.log('🔓 Unlocking Secret Santa reveal...');

        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in .env');
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const settings = await Settings.findOne({ key: 'app-settings' });

        if (!settings) {
            console.error('❌ Settings not found! Did you seed the database?');
            process.exit(1);
        }

        settings.revealLocked = false;
        // Ensure reveal date is in the past so the UI allows it immediately
        settings.revealDate = new Date('2024-12-25T00:00:00Z');

        await settings.save();

        console.log('✅ Reveal successfully unlocked!');
        console.log(`📅 Reveal Date set to: ${settings.revealDate}`);
        console.log('🔓 Reveal Locked status: ', settings.revealLocked);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error unlocking reveal:', error);
        process.exit(1);
    }
};

unlockReveal();
