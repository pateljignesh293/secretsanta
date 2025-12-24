import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Settings from '../models/Settings.js';
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

const seedDatabase = async () => {
    try {
        console.log('🌱 Starting database seeding...');

        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await User.deleteMany({});
        await Settings.deleteMany({});

        // Create users
        console.log('👥 Creating users...');
        const users = await User.insertMany(
            sampleUsers.map(user => ({
                ...user,
                isActive: true,
                hasLoggedIn: false,
                hasRevealed: false,
            }))
        );
        console.log(`✅ Created ${users.length} users`);

        // Create default settings
        console.log('⚙️  Creating default settings...');
        const settings = await Settings.create({
            key: 'app-settings',
            revealDate: new Date(process.env.REVEAL_DATE || '2025-12-25T00:00:00Z'),
            pairingLocked: false,
            revealLocked: true,
            maxParticipants: 30,
            giftSubmissionDeadline: new Date('2025-12-24T23:59:59Z'),
        });
        console.log('✅ Settings created');

        // Print admin credentials
        console.log('\n📧 ADMIN LOGIN CREDENTIALS:');
        console.log('Email: alice.johnson@company.com');
        console.log('Role: admin');
        console.log('\n📧 SAMPLE USER CREDENTIALS:');
        console.log('Email: bob.smith@company.com');
        console.log('Email: charlie.brown@company.com');
        console.log('(Use OTP: 1234 for simulated login)\n');

        console.log('\n🎉 Database seeded successfully!');
        console.log(`📊 Total users: ${users.length}`);
        console.log(`🗓️  Reveal date: ${settings.revealDate}`);
        console.log('\n💡 Next steps:');
        console.log('1. Start the server: npm run server');
        console.log('2. Start the client: npm run client');
        console.log('3. Login as admin to generate pairings');
        console.log('4. Test the application!\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
