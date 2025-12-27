import { User } from '@/models/User';
import { Order } from '@/models/Order';
import { EmailSubscriber } from '@/models/EmailSubscriber';
import { EmailService } from './emailService';

export class SyncService {
    /**
     * Sync all users from the User collection to EmailSubscriber
     */
    static async syncUsers() {
        try {
            const users = await User.find({});
            let added = 0;
            let updated = 0;
            let skipped = 0;

            for (const user of users) {
                if (!user.email) continue;

                const existing = await EmailSubscriber.findOne({ email: user.email.toLowerCase() });

                if (existing) {
                    // Update phone if missing
                    if (user.phone && !existing.phone) {
                        existing.phone = user.phone;
                        await existing.save();
                        updated++;
                    } else {
                        skipped++;
                    }
                } else {
                    // Create new subscriber
                    await EmailService.addSubscriber(
                        user.email,
                        user.name || 'User',
                        'registration'
                    );
                    // Manually update phone/source since addSubscriber might not handle it all
                    await EmailSubscriber.findOneAndUpdate(
                        { email: user.email.toLowerCase() },
                        {
                            phone: user.phone,
                            importedAt: new Date(),
                            source: 'registration' // Ensure source is correct
                        }
                    );
                    added++;
                }
            }

            return { added, updated, skipped, total: users.length };
        } catch (error) {
            console.error('Error syncing users:', error);
            throw error;
        }
    }

    /**
     * Sync all customers from Orders to EmailSubscriber
     */
    static async syncOrders() {
        try {
            const orders = await Order.find({});
            let added = 0;
            let updated = 0;
            let skipped = 0;

            // Use a Map to deduplicate emails from orders before processing
            const uniqueOrders = new Map();
            orders.forEach((order: any) => {
                if (order.email) {
                    uniqueOrders.set(order.email.toLowerCase(), order);
                }
            });

            for (const order of uniqueOrders.values()) {
                const existing = await EmailSubscriber.findOne({ email: order.email.toLowerCase() });

                if (existing) {
                    // Update phone if missing
                    if (order.phone && !existing.phone) {
                        existing.phone = order.phone;
                        await existing.save();
                        updated++;
                    } else {
                        skipped++;
                    }
                } else {
                    // Create new subscriber
                    await EmailService.addSubscriber(
                        order.email,
                        order.name || 'Customer',
                        'order'
                    );
                    // Manually update phone
                    await EmailSubscriber.findOneAndUpdate(
                        { email: order.email.toLowerCase() },
                        {
                            phone: order.phone,
                            importedAt: new Date(),
                            source: 'order'
                        }
                    );
                    added++;
                }
            }

            return { added, updated, skipped, total: uniqueOrders.size };
        } catch (error) {
            console.error('Error syncing orders:', error);
            throw error;
        }
    }

    /**
     * Get a list of all phone numbers from subscribers
     */
    static async getPhoneNumbers() {
        try {
            const subscribers = await EmailSubscriber.find({
                phone: { $exists: true, $ne: '' },
                isActive: true
            }).select('name phone email source');

            return subscribers;
        } catch (error) {
            console.error('Error getting phone numbers:', error);
            throw error;
        }
    }
}
