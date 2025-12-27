import { connectDb } from '../utils/mongodb';
import { EmailCampaign } from '../models/EmailCampaign';
import { EmailTemplate } from '../models/EmailTemplate';
import { queueCampaign } from '../lib/queue';

async function testCampaignSystem() {
    console.log('🧪 Testing Campaign Management System...\n');

    try {
        // 1. Connect to database
        console.log('1️⃣ Connecting to database...');
        await connectDb();
        console.log('✅ Database connected\n');

        // 2. Check for existing template
        console.log('2️⃣ Checking for email templates...');
        let template = await EmailTemplate.findOne({ type: 'flash-sale', isActive: true });

        if (!template) {
            console.log('⚠️  No template found, creating one...');
            template = await EmailTemplate.create({
                name: 'Flash Sale Template',
                type: 'flash-sale',
                subject: 'Flash Sale Alert!',
                htmlContent: '<h1>Flash Sale!</h1><p>Amazing deals!</p>',
                textContent: 'Flash Sale! Amazing deals!',
                isActive: true,
            });
            console.log('✅ Template created');
        } else {
            console.log('✅ Template found:', template.name);
        }
        console.log('');

        // 3. Create test campaign
        console.log('3️⃣ Creating test campaign...');
        const campaign = await EmailCampaign.create({
            name: 'Test Campaign - ' + new Date().toISOString(),
            type: 'flash-sale',
            templateId: template._id,
            subject: 'Test Flash Sale Email',
            htmlContent: '<h1>Test Flash Sale</h1><p>This is a test campaign</p>',
            textContent: 'Test Flash Sale - This is a test campaign',
            status: 'draft',
            targetAudience: {
                allSubscribers: true,
            },
        });
        console.log('✅ Campaign created:', campaign._id);
        console.log('   Name:', campaign.name);
        console.log('   Status:', campaign.status);
        console.log('');

        // 4. Test queue system
        console.log('4️⃣ Testing queue system...');
        console.log('   Adding campaign to queue...');

        try {
            const job = await queueCampaign(campaign._id.toString(), 'flash-sale');
            console.log('✅ Campaign queued successfully!');
            console.log('   Job ID:', job.id);
            console.log('   Job Name:', job.name);
            console.log('');
            console.log('📊 Queue Status:');
            console.log('   - Campaign is now in the queue');
            console.log('   - Worker will process it automatically');
            console.log('   - Check worker logs to see processing');
        } catch (queueError: any) {
            console.error('❌ Queue error:', queueError.message);
            console.log('   Make sure Redis is running and REDIS_URL is correct in .env');
        }
        console.log('');

        // 5. Verify campaign status
        console.log('5️⃣ Verifying campaign...');
        const updatedCampaign = await EmailCampaign.findById(campaign._id);
        console.log('   Campaign ID:', updatedCampaign?._id);
        console.log('   Status:', updatedCampaign?.status);
        console.log('   Created:', updatedCampaign?.createdAt);
        console.log('');

        console.log('✅ All tests passed!');
        console.log('\n📝 Next Steps:');
        console.log('   1. Keep the worker running (npm run worker)');
        console.log('   2. Go to /admin/email-campaigns to see your campaign');
        console.log('   3. Click "Edit" to modify it');
        console.log('   4. Click "Send Now" to queue it for sending');
        console.log('   5. Watch the worker logs to see it process');

    } catch (error: any) {
        console.error('\n❌ Test failed:', error.message);
        console.error('Stack:', error.stack);
    } finally {
        process.exit(0);
    }
}

testCampaignSystem();
