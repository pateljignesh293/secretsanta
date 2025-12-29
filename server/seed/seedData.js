import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Settings from '../models/Settings.js';
import Gift from '../models/Gift.js';
import Pairing from '../models/Pairing.js';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Sample departments
const departments = [
    'Engineering',
    'Marketing',
    'Sales',
    'HR',
    'Finance',
    'Product',
    'Design',
    'Operations',
    'Customer Success',
    'IT',
];

// Sample user data for 30 people
const sampleUsers = [
    { name: 'Alice Johnson', email: 'alice.johnson@company.com', department: 'Engineering', role: 'admin' },
    { name: 'Bob Smith', email: 'bob.smith@company.com', department: 'Engineering' },
    { name: 'Charlie Brown', email: 'charlie.brown@company.com', department: 'Marketing' },
    { name: 'Diana Prince', email: 'diana.prince@company.com', department: 'Sales' },
    { name: 'Ethan Hunt', email: 'ethan.hunt@company.com', department: 'HR' },
    { name: 'Fiona Green', email: 'fiona.green@company.com', department: 'Finance' },
    { name: 'George Miller', email: 'george.miller@company.com', department: 'Product' },
    { name: 'Hannah Montana', email: 'hannah.montana@company.com', department: 'Design' },
    { name: 'Ian Malcolm', email: 'ian.malcolm@company.com', department: 'Engineering' },
    { name: 'Julia Roberts', email: 'julia.roberts@company.com', department: 'Marketing' },
    { name: 'Kevin Hart', email: 'kevin.hart@company.com', department: 'Sales' },
    { name: 'Laura Palmer', email: 'laura.palmer@company.com', department: 'Operations' },
    { name: 'Mike Ross', email: 'mike.ross@company.com', department: 'Engineering' },
    { name: 'Nina Simone', email: 'nina.simone@company.com', department: 'Customer Success' },
    { name: 'Oscar Isaac', email: 'oscar.isaac@company.com', department: 'IT' },
    { name: 'Pam Beesly', email: 'pam.beesly@company.com', department: 'Design' },
    { name: 'Quinn Fabray', email: 'quinn.fabray@company.com', department: 'Marketing' },
    { name: 'Rachel Green', email: 'rachel.green@company.com', department: 'Sales' },
    { name: 'Steve Rogers', email: 'steve.rogers@company.com', department: 'Engineering' },
    { name: 'Tony Stark', email: 'tony.stark@company.com', department: 'Product' },
    { name: 'Uma Thurman', email: 'uma.thurman@company.com', department: 'Finance' },
    { name: 'Victor Stone', email: 'victor.stone@company.com', department: 'IT' },
    { name: 'Wanda Maximoff', email: 'wanda.maximoff@company.com', department: 'Engineering' },
    { name: 'Xavier Woods', email: 'xavier.woods@company.com', department: 'HR' },
    { name: 'Yara Greyjoy', email: 'yara.greyjoy@company.com', department: 'Operations' },
    { name: 'Zoe Washburne', email: 'zoe.washburne@company.com', department: 'Customer Success' },
    { name: 'Aaron Paul', email: 'aaron.paul@company.com', department: 'Marketing' },
    { name: 'Bella Swan', email: 'bella.swan@company.com', department: 'Design' },
    { name: 'Clark Kent', email: 'clark.kent@company.com', department: 'Engineering' },
    { name: 'Daisy Johnson', email: 'daisy.johnson@company.com', department: 'Product' },
];

const giftSamples = [
    { name: 'Coffee Mug', msg: 'Hope you like coffee!', img: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&q=80' },
    { name: 'Vintage Notebook', msg: 'For your brilliant ideas.', img: 'https://images.unsplash.com/photo-1531346878377-a513bc95ba0e?w=500&q=80' },
    { name: 'Noise Cancelling Headphones', msg: 'Enjoy the tunes!', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80' },
    { name: 'Succulent Plant', msg: 'Something green for your desk.', img: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500&q=80' },
    { name: 'Desk Lamp', msg: 'Let there be light!', img: 'https://images.unsplash.com/photo-1507473888900-52e1adad54cd?w=500&q=80' },
    { name: 'Water Bottle', msg: 'Stay hydrated!', img: 'https://images.unsplash.com/photo-1602143407151-01114192003b?w=500&q=80' },
    { name: 'Scented Candle', msg: 'Relax and unwind.', img: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=500&q=80' },
    { name: 'Board Game', msg: 'For game nights!', img: 'https://images.unsplash.com/photo-1610890716171-6b1f9f257a07?w=500&q=80' },
    { name: 'Chocolate Box', msg: 'Sweet treats for you.', img: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500&q=80' },
    { name: 'Portable Charger', msg: 'Power on the go.', img: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&q=80' },
];

const seedDatabase = async () => {
    try {
        console.log('🌱 Starting database seeding...');

        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await Promise.all([
            User.deleteMany({}),
            Settings.deleteMany({}),
            Pairing.deleteMany({}),
            Gift.deleteMany({}),
        ]);

        // Create users
        console.log('👥 Creating users...');
        const createdUsers = await User.insertMany(
            sampleUsers.map(user => ({
                ...user,
                isActive: true,
                hasLoggedIn: false,
                hasRevealed: false,
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&color=fff&size=200`
            }))
        );
        console.log(`✅ Created ${createdUsers.length} users`);

        // Create default settings
        console.log('⚙️  Creating default settings...');
        const settings = await Settings.create({
            key: 'app-settings',
            revealDate: new Date(process.env.REVEAL_DATE || '2025-12-25T00:00:00Z'),
            pairingLocked: true, // We are generating pairings, so lock it
            revealLocked: true,
            pairingGeneratedAt: new Date(),
            maxParticipants: 50,
            giftSubmissionDeadline: new Date('2025-12-24T23:59:59Z'),
        });
        console.log('✅ Settings created');

        // Generate pairings (Basic circular shuffle)
        console.log('🎁 Generating pairings...');
        const userIds = createdUsers.map(u => u._id);
        const shuffled = [...userIds].sort(() => 0.5 - Math.random());

        const pairings = [];
        for (let i = 0; i < shuffled.length; i++) {
            const giverId = shuffled[i];
            const receiverId = shuffled[(i + 1) % shuffled.length]; // Circular pairing

            pairings.push({
                giver: giverId,
                receiver: receiverId,
                isNotified: true,
                notifiedAt: new Date(),
            });
        }

        const createdPairings = await Pairing.insertMany(pairings);
        console.log(`✅ Created ${createdPairings.length} pairings`);

        // Create gifts for ~80% of pairings
        console.log('📦 Creating dummy gifts...');
        const gifts = [];
        let giftCount = 0;

        for (const pairing of createdPairings) {
            if (Math.random() > 0.2) { // 80% chance
                const sample = giftSamples[Math.floor(Math.random() * giftSamples.length)];
                gifts.push({
                    giver: pairing.giver,
                    giftName: sample.name,
                    message: sample.msg,
                    imageUrl: sample.img,
                    imagePublicId: `dummy_${Date.now()}_${Math.random()}`,
                    submittedAt: new Date(Date.now() - Math.floor(Math.random() * 10000000)), // Random time in past
                });
                giftCount++;
            }
        }

        const createdGifts = await Gift.insertMany(gifts);
        console.log(`✅ Created ${createdGifts.length} gifts`);

        // Print details
        console.log('\n📧 ADMIN LOGIN CREDENTIALS:');
        console.log('Email: alice.johnson@company.com');
        console.log('Role: admin');
        console.log('\n📧 SAMPLE USER CREDENTIALS:');
        console.log('Email: bob.smith@company.com');
        console.log('Email: charlie.brown@company.com');
        console.log('(Use OTP: 1234 for simulated login)\n');

        console.log('\n🎉 Database seeded successfully!');
        console.log(`📊 Stats:`);
        console.log(`- Users: ${createdUsers.length}`);
        console.log(`- Pairings: ${createdPairings.length}`);
        console.log(`- Gifts: ${createdGifts.length}`);
        console.log(`🗓️  Reveal date: ${settings.revealDate.toISOString().split('T')[0]}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
