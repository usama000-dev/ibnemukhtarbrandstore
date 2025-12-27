import { connectDb } from '../utils/mongodb';
import { SyncService } from '../services/syncService';
import { EmailSubscriber } from '../models/EmailSubscriber';
import { User } from '../models/User';

const testLiveSync = async () => {
    console.log('🚀 Starting Live Sync Test...');

    try {
        await connectDb();
        console.log('✅ Connected to Database');

        // 1. Sync Users
        console.log('\n🔄 Syncing Users...');
        const userStats = await SyncService.syncUsers();
        console.log('📊 User Sync Stats:', userStats);

        // 2. Sync Orders
        console.log('\n🔄 Syncing Orders...');
        const orderStats = await SyncService.syncOrders();
        console.log('📊 Order Sync Stats:', orderStats);

        // 3. Verify a sample user
        const sampleUser = await User.findOne({ email: { $exists: true } });
        if (sampleUser) {
            const subscriber = await EmailSubscriber.findOne({ email: sampleUser.email.toLowerCase() });
            if (subscriber) {
                console.log('\n✅ Verification Successful:');
                console.log(`   User ${sampleUser.email} found in subscribers.`);
                console.log(`   Phone: ${subscriber.phone || 'N/A'}`);
                console.log(`   Source: ${subscriber.source}`);
            } else {
                console.error('\n❌ Verification Failed: User found in DB but not in Subscribers after sync.');
            }
        } else {
            console.log('\n⚠️ No users found in DB to verify against.');
        }

        // 4. Verify Phone Export
        console.log('\n📱 Testing Phone Export...');
        const phones = await SyncService.getPhoneNumbers();
        console.log(`   Found ${phones.length} subscribers with phone numbers.`);

        console.log('\n✨ Test Complete!');
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Test Failed:', error);
        process.exit(1);
    }
};

testLiveSync();
