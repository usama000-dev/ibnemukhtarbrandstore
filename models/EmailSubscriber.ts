import mongoose from "mongoose";

const emailSubscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, sparse: true, trim: true },
  name: { type: String, default: "" },
  source: { type: String, enum: ['registration', 'order', 'manual', 'import'], required: true },
  isActive: { type: Boolean, default: true },
  preferences: {
    flashSales: { type: Boolean, default: true },
    deals: { type: Boolean, default: true },
    newsletters: { type: Boolean, default: true },
    productUpdates: { type: Boolean, default: true },
    welcome: { type: Boolean, default: true },
  },
  lastEmailSent: { type: Date },
  lastCampaignType: {
    'flash-sale': { type: Date },
    'deal': { type: Date },
    'newsletter': { type: Date },
    'product-update': { type: Date },
    'welcome': { type: Date },
  },
  totalEmailsSent: { type: Number, default: 0 },
  unsubscribeToken: { type: String, unique: true },
  subscribedAt: { type: Date, default: Date.now },

  // Welcome email sequence tracking
  welcomeEmailSent: { type: Boolean, default: false },
  welcomeEmailSentAt: { type: Date },
  introEmailSent: { type: Boolean, default: false },
  introEmailSentAt: { type: Date },

  // CRM Notes
  notes: { type: String, default: "" },

  // Segmentation
  tags: [{ type: String }],
  interests: [{ type: String }],

  // Click tracking
  totalClicks: { type: Number, default: 0 },
  lastClickAt: { type: Date },

  // Export tracking
  exportedAt: { type: Date },
  importedAt: { type: Date },

}, { timestamps: true });

// Indexes for better query performance
emailSubscriberSchema.index({ email: 1 });
emailSubscriberSchema.index({ phone: 1 }, { sparse: true });
emailSubscriberSchema.index({ isActive: 1 });
emailSubscriberSchema.index({ source: 1 });
emailSubscriberSchema.index({ lastEmailSent: 1 });
emailSubscriberSchema.index({ 'lastCampaignType.flash-sale': 1 });
emailSubscriberSchema.index({ 'lastCampaignType.deal': 1 });
emailSubscriberSchema.index({ welcomeEmailSent: 1 });
emailSubscriberSchema.index({ introEmailSent: 1 });
emailSubscriberSchema.index({ tags: 1 });
emailSubscriberSchema.index({ interests: 1 });

export const EmailSubscriber = mongoose.models.EmailSubscriber || mongoose.model("EmailSubscriber", emailSubscriberSchema);