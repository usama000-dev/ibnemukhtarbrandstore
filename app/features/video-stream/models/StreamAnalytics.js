import mongoose from 'mongoose';

const streamAnalyticsSchema = new mongoose.Schema({
    videoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StreamPost',
        required: true,
        index: true
    },
    date: {
        type: String, // Format: YYYY-MM-DD for daily aggregation
        required: true,
        index: true
    },
    metrics: {
        views: { type: Number, default: 0 },
        uniqueViewers: { type: Number, default: 0 },
        averageWatchTime: { type: Number, default: 0 }, // Seconds
        likes: { type: Number, default: 0 },
        shares: { type: Number, default: 0 },
        productClicks: { type: Number, default: 0 },
        adImpressions: { type: Number, default: 0 },
        adClicks: { type: Number, default: 0 }
    }
}, {
    timestamps: true
});

// Composite index to fetch stats for a specific video on a specific day
streamAnalyticsSchema.index({ videoId: 1, date: 1 }, { unique: true });

export const StreamAnalytics = mongoose.models.StreamAnalytics || mongoose.model('StreamAnalytics', streamAnalyticsSchema);
