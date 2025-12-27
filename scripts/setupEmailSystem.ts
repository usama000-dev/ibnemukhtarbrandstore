import { EmailTemplate } from '@/models/EmailTemplate';
import { EmailCollectionService } from '@/utils/emailCollection';
import { defaultEmailTemplates } from '@/utils/emailTemplates';
import { connectDb } from '@/utils/mongodb';

async function setupEmailSystem() {
  try {
    console.log('🚀 Starting Email Marketing System Setup...\n');

    // Connect to database
    await connectDb();
    console.log('✅ Connected to database\n');

    // Step 1: Create default email templates
    console.log('📧 Creating default email templates...');
    for (const [type, template] of Object.entries(defaultEmailTemplates)) {
      const existingTemplate = await EmailTemplate.findOne({ type });
      
      if (!existingTemplate) {
        // Convert variables array to proper format
        const formattedTemplate = {
          ...template,
          variables: template.variables.map((variable: string) => ({
            name: variable,
            description: `Variable for ${variable}`,
            defaultValue: ''
          }))
        };
        
        await EmailTemplate.create(formattedTemplate);
        console.log(`✅ Created ${template.name} template`);
      } else {
        console.log(`⏭️  ${template.name} template already exists`);
      }
    }
    console.log('');

    // Step 2: Collect emails from existing users and orders
    console.log('📬 Collecting emails from existing data...');
    const collectionResults = await EmailCollectionService.collectAllEmails();
    
    console.log('📊 Collection Results:');
    console.log(`   Users: ${collectionResults.users.added} added, ${collectionResults.users.skipped} skipped`);
    console.log(`   Orders: ${collectionResults.orders.added} added, ${collectionResults.orders.skipped} skipped`);
    console.log(`   Total: ${collectionResults.total.added} added, ${collectionResults.total.skipped} skipped`);
    console.log('');

    // Step 3: Clean up any duplicate emails
    console.log('🧹 Cleaning up duplicate emails...');
    const cleanupResults = await EmailCollectionService.cleanupDuplicates();
    console.log(`✅ Removed ${cleanupResults.cleaned} duplicate records`);
    console.log('');

    // Step 4: Get final statistics
    console.log('📈 Final Email System Statistics:');
    const stats = await EmailCollectionService.getCollectionStats();
    console.log(`   Total Subscribers: ${stats.totalSubscribers}`);
    console.log(`   Active Subscribers: ${stats.activeSubscribers}`);
    console.log('');
    console.log('   Source Breakdown:');
    stats.sourceBreakdown.forEach((source: any) => {
      console.log(`     ${source._id}: ${source.count}`);
    });
    console.log('');
    console.log('   Preference Breakdown:');
    console.log(`     Deals: ${stats.preferenceBreakdown.deals}`);
    console.log(`     Flash Sales: ${stats.preferenceBreakdown.flashSales}`);
    console.log(`     Newsletters: ${stats.preferenceBreakdown.newsletters}`);
    console.log(`     Product Updates: ${stats.preferenceBreakdown.productUpdates}`);
    console.log('');

    console.log('🎉 Email Marketing System Setup Complete!');
    console.log('');
    console.log('📋 Next Steps:');
    console.log('   1. Configure your SMTP settings in .env file');
    console.log('   2. Add EmailSubscriptionForm component to your website');
    console.log('   3. Access admin dashboard at /admin/email-campaigns');
    console.log('   4. Create your first email campaign');
    console.log('');
    console.log('🔧 Required Environment Variables:');
    console.log('   SMTP_HOST=smtp.gmail.com');
    console.log('   SMTP_PORT=587');
    console.log('   SMTP_USER=your-email@gmail.com');
    console.log('   SMTP_PASS=your-app-password');
    console.log('   EMAIL_FROM_NAME=Your Store Name');
    console.log('   NEXT_PUBLIC_BASE_URL=https://yourdomain.com');

  } catch (error) {
    console.error('❌ Error during email system setup:', error);
    process.exit(1);
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupEmailSystem()
    .then(() => {
      console.log('✅ Setup completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Setup failed:', error);
      process.exit(1);
    });
}

export { setupEmailSystem }; 