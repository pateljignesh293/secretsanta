import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Settings from './server/models/Settings.js';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const extendDeadline = async () => {
    try {
        console.log('🕒 Extending gift submission deadline...');

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

        // Set deadline to next year
        settings.giftSubmissionDeadline = new Date('2025-12-31T23:59:59Z');

        await settings.save();

        console.log('✅ Deadline successfully extended!');
        console.log(`📅 New Deadline: ${settings.giftSubmissionDeadline}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error extending deadline:', error);
        process.exit(1);
    }
};

extendDeadline();
