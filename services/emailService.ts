import { Resend } from 'resend';
import crypto from 'crypto';
import { EmailSubscriber } from '@/models/EmailSubscriber';
import { EmailTemplate } from '@/models/EmailTemplate';
import { EmailCampaign } from '@/models/EmailCampaign';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

export class EmailService {
  private static isDev = process.env.NODE_ENV !== 'production';

  // Generate unsubscribe token
  static generateUnsubscribeToken(email: string): string {
    return crypto.createHash('sha256').update(email + Date.now()).digest('hex');
  }

  // Add or update subscriber
  static async addSubscriber(email: string, name: string = '', source: 'registration' | 'order' | 'manual' = 'manual') {
    try {
      const unsubscribeToken = this.generateUnsubscribeToken(email);

      const subscriber = await EmailSubscriber.findOneAndUpdate(
        { email: email.toLowerCase() },
        {
          email: email.toLowerCase(),
          name,
          source,
          unsubscribeToken,
          isActive: true,
        },
        { upsert: true, new: true }
      );

      return subscriber;
    } catch (error) {
      console.error('Error adding subscriber:', error);
      throw error;
    }
  }

  // Get subscribers based on preferences with cooldown check
  static async getSubscribers(preferences: string[] = [], limit: number = 1000, campaignType?: string) {
    try {
      const query: any = { isActive: true };

      if (preferences.length > 0) {
        const preferenceQuery = preferences.map(pref => ({ [`preferences.${pref}`]: true }));
        query.$or = preferenceQuery;
      }

      // Add cooldown check to prevent duplicate sends
      if (campaignType) {
        const cooldownHours = 24; // 24 hours cooldown between same type campaigns
        const cooldownDate = new Date();
        cooldownDate.setHours(cooldownDate.getHours() - cooldownHours);

        query.$or = query.$or || [];
        query.$or.push(
          { lastEmailSent: { $exists: false } },
          { lastEmailSent: { $lt: cooldownDate } },
          { [`lastCampaignType.${campaignType}`]: { $exists: false } },
          { [`lastCampaignType.${campaignType}`]: { $lt: cooldownDate } }
        );
      }

      const subscribers = await EmailSubscriber.find(query)
        .limit(limit)
        .sort({ lastEmailSent: 1 });

      return subscribers;
    } catch (error) {
      console.error('Error getting subscribers:', error);
      throw error;
    }
  }

  // Generate unique content for each campaign
  static generateUniqueContent(templateContent: string, campaignData: any, campaignType: string): string {
    let content = templateContent;

    // Add unique campaign ID
    const campaignId = crypto.randomBytes(8).toString('hex');
    content = content.replace(/{{campaignId}}/g, campaignId);

    // Add timestamp
    const timestamp = new Date().toISOString();
    content = content.replace(/{{timestamp}}/g, timestamp);

    // Add unique sale/deal identifier
    const uniqueIdentifier = `${campaignType}-${Date.now()}`;
    content = content.replace(/{{uniqueId}}/g, uniqueIdentifier);

    // Handle #each blocks for products
    content = content.replace(/{{#each products}}([\s\S]*?){{\/each}}/g, (match, block) => {
      let products: any[] = [];
      try {
        // Try to parse products from campaignData (may be stringified)
        if (Array.isArray(campaignData.products)) {
          products = campaignData.products;
        } else if (typeof campaignData.products === 'string') {
          products = JSON.parse(campaignData.products);
        }
      } catch (e) {
        products = [];
      }
      if (!products || !products.length) return '';
      return products.map(product => {
        let productBlock = block;
        // Replace all {{var}} in block with product[var] or blank
        productBlock = productBlock.replace(/{{(\w+)}}/g, (__: any, key: string | number) =>
          product[key] !== undefined && product[key] !== null ? String(product[key]) : ''
        );
        return productBlock;
      }).join('');
    });

    // Replace all other variables (including missing ones)
    content = content.replace(/{{(\w+)}}/g, (__, key) => {
      if (campaignData[key] !== undefined && campaignData[key] !== null) {
        return String(campaignData[key]);
      }
      return '';
    });

    return content;
  }

  // Process template variables
  static processTemplate(content: string, variables: Record<string, string>): string {
    let processedContent = content;

    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      processedContent = processedContent.replace(regex, value);
    });

    return processedContent;
  }

  // Send single email
  static async sendEmail(to: string, subject: string, htmlContent: string, textContent: string, scheduledAt?: string) {
    try {
      // In development, if no API Key is set, simulate sending
      if (this.isDev && !process.env.RESEND_API_KEY) {
        console.log(`[DEV MODE] 📧 Simulate sending email to ${to}`);
        console.log(`[DEV MODE] Subject: ${subject}`);
        if (scheduledAt) console.log(`[DEV MODE] Scheduled for: ${scheduledAt}`);

        // Return a mocked result
        const result = {
          id: `mock-${Date.now()}`,
          success: true,
          message: '[DEV MOCK] Email simulated'
        };

        // Update subscriber stats (copy-pasted from below to ensure consistency)
        await EmailSubscriber.findOneAndUpdate(
          { email: to.toLowerCase() },
          {
            $inc: { totalEmailsSent: 1 },
            lastEmailSent: new Date(),
          }
        );

        return result;
      }

      const fromName = process.env.EMAIL_FROM_NAME || 'Champion Choice';
      const fromAddress = process.env.EMAIL_FROM_ADDRESS || 'onboarding@resend.dev';

      const payload: any = {
        from: `${fromName} <${fromAddress}>`,
        to: [to],
        subject,
        html: htmlContent,
        text: textContent,
      };

      if (scheduledAt) {
        payload.scheduled_at = scheduledAt;
      }

      const result = await resend.emails.send(payload);

      if (result.error) {
        console.error('Resend API Error:', result.error);
        throw new Error(`Resend Error: ${result.error.message}`);
      }

      // Update subscriber stats
      await EmailSubscriber.findOneAndUpdate(
        { email: to.toLowerCase() },
        {
          $inc: { totalEmailsSent: 1 },
          lastEmailSent: new Date(),
        }
      );

      return result.data;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  // Send campaign with duplicate prevention
  static async sendCampaign(campaignId: string) {
    try {
      const campaign = await EmailCampaign.findById(campaignId);
      if (!campaign) {
        throw new Error('Campaign not found');
      }

      // Update campaign status
      await EmailCampaign.findByIdAndUpdate(campaignId, { status: 'sending' });

      // Get subscribers based on target audience with cooldown check
      let subscribers;
      if (campaign.targetAudience.allSubscribers) {
        subscribers = await this.getSubscribers([], 1000, campaign.type);
      } else if (campaign.targetAudience.specificPreferences.length > 0) {
        subscribers = await this.getSubscribers(campaign.targetAudience.specificPreferences, 1000, campaign.type);
      } else {
        subscribers = await this.getSubscribers([], 1000, campaign.type);
      }

      // Update campaign analytics
      await EmailCampaign.findByIdAndUpdate(campaignId, {
        'analytics.totalSubscribers': subscribers.length
      });

      // Send emails in batches
      const batchSize = 50;
      let emailsSent = 0;
      let emailsFailed = 0;

      for (let i = 0; i < subscribers.length; i += batchSize) {
        const batch = subscribers.slice(i, i + batchSize);

        const promises = batch.map(async (subscriber) => {
          try {
            // Generate unique content for each subscriber
            const uniqueHtml = this.generateUniqueContent(campaign.htmlContent, {
              ...campaign.variables,
              subscriberName: subscriber.name,
              unsubscribeLink: `${process.env.NEXT_PUBLIC_BASE_URL}/unsubscribe?token=${subscriber.unsubscribeToken}`,
            }, campaign.type);

            const uniqueText = this.generateUniqueContent(campaign.textContent, {
              ...campaign.variables,
              subscriberName: subscriber.name,
              unsubscribeLink: `${process.env.NEXT_PUBLIC_BASE_URL}/unsubscribe?token=${subscriber.unsubscribeToken}`,
            }, campaign.type);

            // Pass scheduledAt if present (ensure it's ISO string)
            const scheduledAtISO = campaign.scheduledAt ? new Date(campaign.scheduledAt).toISOString() : undefined;

            await this.sendEmail(subscriber.email, campaign.subject, uniqueHtml, uniqueText, scheduledAtISO);

            // Update subscriber with campaign type tracking
            await EmailSubscriber.findOneAndUpdate(
              { email: subscriber.email },
              {
                lastEmailSent: new Date(),
                [`lastCampaignType.${campaign.type}`]: new Date(),
                totalEmailsSent: subscriber.totalEmailsSent + 1,
              }
            );

            emailsSent++;
          } catch (error) {
            console.error(`Failed to send email to ${subscriber.email}:`, error);
            emailsFailed++;
          }
        });

        await Promise.all(promises);

        // Add delay between batches to avoid rate limiting
        if (i + batchSize < subscribers.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      // Update campaign completion
      await EmailCampaign.findByIdAndUpdate(campaignId, {
        status: 'sent',
        sentAt: new Date(),
        completedAt: new Date(),
        'analytics.emailsSent': emailsSent,
        'analytics.emailsDelivered': emailsSent - emailsFailed,
      });

      return { emailsSent, emailsFailed, totalSubscribers: subscribers.length };
    } catch (error) {
      console.error('Error sending campaign:', error);
      await EmailCampaign.findByIdAndUpdate(campaignId, { status: 'failed' });
      throw error;
    }
  }

  // Create and send flash sale email with unique content
  static async sendFlashSaleEmail(saleData: {
    title: string;
    description: string;
    discount: string;
    endTime: string;
    products: Array<{ name: string; originalPrice: number; salePrice: number; image: string }>;
  }) {
    try {
      // Get flash sale template
      const template = await EmailTemplate.findOne({ type: 'flash-sale', isActive: true });
      if (!template) {
        throw new Error('Flash sale template not found');
      }

      // Generate unique content
      const uniqueHtml = this.generateUniqueContent(template.htmlContent, {
        saleTitle: saleData.title,
        saleDescription: saleData.description,
        discount: saleData.discount,
        endTime: saleData.endTime,
        products: JSON.stringify(saleData.products),
      }, 'flash-sale');

      const uniqueText = this.generateUniqueContent(template.textContent, {
        saleTitle: saleData.title,
        saleDescription: saleData.description,
        discount: saleData.discount,
        endTime: saleData.endTime,
        products: JSON.stringify(saleData.products),
      }, 'flash-sale');

      // Create campaign
      const campaign = await EmailCampaign.create({
        name: `Flash Sale: ${saleData.title}`,
        type: 'flash-sale',
        templateId: template._id,
        subject: `🔥 FLASH SALE: ${saleData.title} - ${saleData.discount} OFF!`,
        htmlContent: uniqueHtml,
        textContent: uniqueText,
        variables: {
          saleTitle: saleData.title,
          saleDescription: saleData.description,
          discount: saleData.discount,
          endTime: saleData.endTime,
          products: JSON.stringify(saleData.products),
        },
        targetAudience: {
          allSubscribers: false,
          specificPreferences: ['flashSales'],
        },
        status: 'draft',
      });

      // Send campaign
      return await this.sendCampaign(campaign._id.toString());
    } catch (error) {
      console.error('Error sending flash sale email:', error);
      throw error;
    }
  }

  // Create and send deal email with unique content
  static async sendDealEmail(dealData: {
    title: string;
    description: string;
    discount: string;
    validUntil: string;
    products: Array<{ name: string; originalPrice: number; salePrice: number; image: string }>;
  }) {
    try {
      // Get deal template
      const template = await EmailTemplate.findOne({ type: 'deal', isActive: true });
      if (!template) {
        throw new Error('Deal template not found');
      }

      // Generate unique content
      const uniqueHtml = this.generateUniqueContent(template.htmlContent, {
        dealTitle: dealData.title,
        dealDescription: dealData.description,
        discount: dealData.discount,
        validUntil: dealData.validUntil,
        products: JSON.stringify(dealData.products),
      }, 'deal');

      const uniqueText = this.generateUniqueContent(template.textContent, {
        dealTitle: dealData.title,
        dealDescription: dealData.description,
        discount: dealData.discount,
        validUntil: dealData.validUntil,
        products: JSON.stringify(dealData.products),
      }, 'deal');

      // Create campaign
      const campaign = await EmailCampaign.create({
        name: `Deal: ${dealData.title}`,
        type: 'deal',
        templateId: template._id,
        subject: `🎉 SPECIAL DEAL: ${dealData.title} - ${dealData.discount} OFF!`,
        htmlContent: uniqueHtml,
        textContent: uniqueText,
        variables: {
          dealTitle: dealData.title,
          dealDescription: dealData.description,
          discount: dealData.discount,
          validUntil: dealData.validUntil,
          products: JSON.stringify(dealData.products),
        },
        targetAudience: {
          allSubscribers: false,
          specificPreferences: ['deals'],
        },
        status: 'draft',
      });

      // Send campaign
      return await this.sendCampaign(campaign._id.toString());
    } catch (error) {
      console.error('Error sending deal email:', error);
      throw error;
    }
  }

  // Send test flash sale email to a single email address
  static async sendTestFlashSaleEmail(email: string, data: any) {
    try {
      // Get flash sale template
      const template = await EmailTemplate.findOne({ type: 'flash-sale', isActive: true });
      if (!template) {
        throw new Error('Flash sale template not found');
      }

      // Generate unique content
      const uniqueHtml = this.generateUniqueContent(template.htmlContent, {
        saleTitle: data.title,
        saleDescription: data.description,
        discount: data.discount,
        endTime: data.endTime,
        products: JSON.stringify(data.products),
      }, 'flash-sale');

      const uniqueText = this.generateUniqueContent(template.textContent, {
        saleTitle: data.title,
        saleDescription: data.description,
        discount: data.discount,
        endTime: data.endTime,
        products: JSON.stringify(data.products),
      }, 'flash-sale');

      // Send test email
      await this.sendEmail(email, `🔥 TEST FLASH SALE: ${data.title} - ${data.discount} OFF!`, uniqueHtml, uniqueText);

      return { success: true, emailSent: email };
    } catch (error) {
      console.error('Error sending test flash sale email:', error);
      throw error;
    }
  }

  // Send test deal email to a single email address
  static async sendTestDealEmail(email: string, data: any) {
    try {
      // Get deal template
      const template = await EmailTemplate.findOne({ type: 'deal', isActive: true });
      if (!template) {
        throw new Error('Deal template not found');
      }

      // Generate unique content
      const uniqueHtml = this.generateUniqueContent(template.htmlContent, {
        dealTitle: data.title,
        dealDescription: data.description,
        discount: data.discount,
        validUntil: data.validUntil,
        products: JSON.stringify(data.products),
      }, 'deal');

      const uniqueText = this.generateUniqueContent(template.textContent, {
        dealTitle: data.title,
        dealDescription: data.description,
        discount: data.discount,
        validUntil: data.validUntil,
        products: JSON.stringify(data.products),
      }, 'deal');

      // Send test email
      await this.sendEmail(email, `🎉 TEST DEAL: ${data.title} - ${data.discount} OFF!`, uniqueHtml, uniqueText);

      return { success: true, emailSent: email };
    } catch (error) {
      console.error('Error sending test deal email:', error);
      throw error;
    }
  }
  // Send a campaign email
  static async sendCampaignEmail(campaign: any) {
    try {
      // Get subscribers based on target audience
      let subscribers;
      if (campaign.targetAudience.allSubscribers) {
        subscribers = await this.getSubscribers([], 10000, campaign.type);
      } else {
        subscribers = await this.getSubscribers(
          campaign.targetAudience.specificPreferences || [],
          10000,
          campaign.type
        );
      }

      if (subscribers.length === 0) {
        throw new Error('No active subscribers found');
      }

      let emailsSent = 0;
      const errors = [];

      for (const subscriber of subscribers) {
        try {
          // Replace variables in content
          let htmlContent = campaign.htmlContent;
          let textContent = campaign.textContent;

          // Replace subscriber-specific variables
          htmlContent = htmlContent.replace(/{{subscriberName}}/g, subscriber.name || 'Valued Customer');
          htmlContent = htmlContent.replace(/{{subscriberEmail}}/g, subscriber.email);
          textContent = textContent.replace(/{{subscriberName}}/g, subscriber.name || 'Valued Customer');
          textContent = textContent.replace(/{{subscriberEmail}}/g, subscriber.email);

          // Add unsubscribe link
          const unsubscribeLink = `${process.env.NEXT_PUBLIC_BASE_URL}/unsubscribe?token=${subscriber.unsubscribeToken}`;
          htmlContent = htmlContent.replace(/{{unsubscribeLink}}/g, unsubscribeLink);
          textContent = textContent.replace(/{{unsubscribeLink}}/g, unsubscribeLink);

          // Add tracking pixel for email opens
          const trackingPixel = `<img src="${process.env.NEXT_PUBLIC_BASE_URL}/api/email/track/open/${campaign._id}/${subscriber._id}" width="1" height="1" style="display:none" alt="" />`;
          htmlContent = htmlContent + trackingPixel;

          // Wrap links with click tracking
          const trackingBaseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/email/track/click?campaign=${campaign._id}&subscriber=${subscriber._id}&url=`;
          htmlContent = htmlContent.replace(/href="([^"]+)"/g, (match: string, url: string) => {
            if (url.startsWith('http')) {
              return `href="${trackingBaseUrl}${encodeURIComponent(url)}"`;
            }
            return match;
          });


          const fromName = process.env.EMAIL_FROM_NAME || 'Champion Choice';
          // Use a verified domain or the resend testing domain
          const fromAddress = process.env.EMAIL_FROM_ADDRESS || 'onboarding@resend.dev';

          const payload: any = {
            from: `${fromName} <${fromAddress}>`,
            to: [subscriber.email],
            subject: campaign.subject,
            html: htmlContent,
            text: textContent,
          };

          if (campaign.scheduledAt) {
            payload.scheduled_at = new Date(campaign.scheduledAt).toISOString();
          }

          const result = await resend.emails.send(payload);

          if (result.error) {
            throw new Error(`Resend Error: ${result.error.message}`);
          }

          emailsSent++;

          // Update subscriber's last email sent
          subscriber.lastEmailSent = new Date();
          await subscriber.save();
        } catch (error: any) {
          console.error(`Failed to send to ${subscriber.email}:`, error.message);
          errors.push({ email: subscriber.email, error: error.message });
        }
      }

      return {
        emailsSent,
        totalSubscribers: subscribers.length,
        errors: errors.length > 0 ? errors : undefined
      };
    } catch (error) {
      console.error('Error sending campaign email:', error);
      throw error;
    }
  }
}
