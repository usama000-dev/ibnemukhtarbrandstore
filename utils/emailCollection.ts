import { EmailService } from '@/services/emailService';
import { User } from '@/models/User';
import { Order } from '@/models/Order';
import { EmailSubscriber } from '@/models/EmailSubscriber';

export class EmailCollectionService {
  // Collect emails from user registrations
  static async collectFromUsers() {
    try {
      console.log('Starting email collection from users...');
      
      const users = await User.find({}, 'email name');
      let addedCount = 0;
      let skippedCount = 0;

      for (const user of users) {
        try {
          // Check if subscriber already exists
          const existingSubscriber = await EmailSubscriber.findOne({ email: user.email.toLowerCase() });
          
          if (!existingSubscriber) {
            await EmailService.addSubscriber(user.email, user.name, 'registration');
            addedCount++;
            console.log(`Added user email: ${user.email}`);
          } else {
            skippedCount++;
          }
        } catch (error) {
          console.error(`Error processing user email ${user.email}:`, error);
        }
      }

      console.log(`Email collection from users completed. Added: ${addedCount}, Skipped: ${skippedCount}`);
      return { added: addedCount, skipped: skippedCount };
    } catch (error) {
      console.error('Error collecting emails from users:', error);
      throw error;
    }
  }

  // Collect emails from orders
  static async collectFromOrders() {
    try {
      console.log('Starting email collection from orders...');
      
      const orders = await Order.find({}, 'email name');
      let addedCount = 0;
      let skippedCount = 0;

      for (const order of orders) {
        try {
          // Check if subscriber already exists
          const existingSubscriber = await EmailSubscriber.findOne({ email: order.email.toLowerCase() });
          
          if (!existingSubscriber) {
            await EmailService.addSubscriber(order.email, order.name, 'order');
            addedCount++;
            console.log(`Added order email: ${order.email}`);
          } else {
            skippedCount++;
          }
        } catch (error) {
          console.error(`Error processing order email ${order.email}:`, error);
        }
      }

      console.log(`Email collection from orders completed. Added: ${addedCount}, Skipped: ${skippedCount}`);
      return { added: addedCount, skipped: skippedCount };
    } catch (error) {
      console.error('Error collecting emails from orders:', error);
      throw error;
    }
  }

  // Collect all emails (users + orders)
  static async collectAllEmails() {
    try {
      console.log('Starting comprehensive email collection...');
      
      const userResults = await this.collectFromUsers();
      const orderResults = await this.collectFromOrders();

      const totalAdded = userResults.added + orderResults.added;
      const totalSkipped = userResults.skipped + orderResults.skipped;

      console.log(`Comprehensive email collection completed. Total Added: ${totalAdded}, Total Skipped: ${totalSkipped}`);
      
      return {
        users: userResults,
        orders: orderResults,
        total: {
          added: totalAdded,
          skipped: totalSkipped
        }
      };
    } catch (error) {
      console.error('Error in comprehensive email collection:', error);
      throw error;
    }
  }

  // Get email collection statistics
  static async getCollectionStats() {
    try {
      const totalSubscribers = await EmailSubscriber.countDocuments();
      const activeSubscribers = await EmailSubscriber.countDocuments({ isActive: true });
      
      const sourceStats = await EmailSubscriber.aggregate([
        {
          $group: {
            _id: '$source',
            count: { $sum: 1 }
          }
        }
      ]);

      const preferenceStats = await EmailSubscriber.aggregate([
        {
          $group: {
            _id: null,
            deals: { $sum: { $cond: ['$preferences.deals', 1, 0] } },
            flashSales: { $sum: { $cond: ['$preferences.flashSales', 1, 0] } },
            newsletters: { $sum: { $cond: ['$preferences.newsletters', 1, 0] } },
            productUpdates: { $sum: { $cond: ['$preferences.productUpdates', 1, 0] } }
          }
        }
      ]);

      return {
        totalSubscribers,
        activeSubscribers,
        sourceBreakdown: sourceStats,
        preferenceBreakdown: preferenceStats[0] || {
          deals: 0,
          flashSales: 0,
          newsletters: 0,
          productUpdates: 0
        }
      };
    } catch (error) {
      console.error('Error getting collection stats:', error);
      throw error;
    }
  }

  // Clean up duplicate emails
  static async cleanupDuplicates() {
    try {
      console.log('Starting duplicate email cleanup...');
      
      const duplicates = await EmailSubscriber.aggregate([
        {
          $group: {
            _id: '$email',
            count: { $sum: 1 },
            docs: { $push: '$_id' }
          }
        },
        {
          $match: {
            count: { $gt: 1 }
          }
        }
      ]);

      let cleanedCount = 0;

      for (const duplicate of duplicates) {
        // Keep the first document, remove the rest
        const docsToRemove = duplicate.docs.slice(1);
        
        await EmailSubscriber.deleteMany({
          _id: { $in: docsToRemove }
        });
        
        cleanedCount += docsToRemove.length;
        console.log(`Cleaned ${docsToRemove.length} duplicates for email: ${duplicate._id}`);
      }

      console.log(`Duplicate cleanup completed. Removed ${cleanedCount} duplicate records`);
      return { cleaned: cleanedCount };
    } catch (error) {
      console.error('Error cleaning up duplicates:', error);
      throw error;
    }
  }
} 