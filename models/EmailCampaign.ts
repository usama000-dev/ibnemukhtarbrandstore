import mongoose from "mongoose";

const emailCampaignSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['flash-sale', 'deal', 'newsletter', 'product-update', 'welcome'],
      required: true,
    },
    templateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EmailTemplate',
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    htmlContent: {
      type: String,
      required: true,
    },
    textContent: {
      type: String,
      required: true,
    },
    variables: {
      type: Map,
      of: String,
      default: {},
    },
    status: {
      type: String,
      enum: ['draft', 'scheduled', 'sending', 'sent', 'failed', 'cancelled'],
      default: 'draft',
    },
    scheduledAt: {
      type: Date,
    },
    sentAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
    targetAudience: {
      allSubscribers: {
        type: Boolean,
        default: false,
      },
      specificPreferences: [{
        type: String,
        enum: ['deals', 'flashSales', 'newsletters', 'productUpdates'],
      }],
      customFilters: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
        default: {},
      },
    },
    analytics: {
      totalSubscribers: {
        type: Number,
        default: 0,
      },
      emailsSent: {
        type: Number,
        default: 0,
      },
      emailsDelivered: {
        type: Number,
        default: 0,
      },
      emailsOpened: {
        type: Number,
        default: 0,
      },
      emailsClicked: {
        type: Number,
        default: 0,
      },
      emailsBounced: {
        type: Number,
        default: 0,
      },
      emailsUnsubscribed: {
        type: Number,
        default: 0,
      },
      openRate: {
        type: Number,
        default: 0,
      },
      clickRate: {
        type: Number,
        default: 0,
      },
    },
    createdBy: {
      type: String,
      default: "admin",
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Create indexes for better performance
emailCampaignSchema.index({ status: 1 });
emailCampaignSchema.index({ type: 1 });
emailCampaignSchema.index({ scheduledAt: 1 });
emailCampaignSchema.index({ createdAt: -1 });

export const EmailCampaign = 
  mongoose.models.EmailCampaign || mongoose.model("EmailCampaign", emailCampaignSchema); 