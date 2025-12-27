import mongoose from 'mongoose';

const streamPostSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['video', 'image', 'poll'],
        required: true,
        default: 'video'
    },
    // Common Fields
    source: {
        type: String, // 'youtube' | 'upload' | 'ad'
        required: true,
        enum: ['youtube', 'upload', 'ad']
    },
    platformId: {
        type: String, // YouTube Video ID or Cloudinary Public ID (Main ID)
        required: true,
        unique: true
    },
    url: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    category: {
        type: String,
        enum: ['poomsae', 'kyorugi', 'fitness', 'tutorial', 'other'],
        default: 'other',
        index: true
    },
    status: {
        type: String,
        enum: ['active', 'archived', 'pending_approval', 'rejected', 'draft'],
        default: 'active',
        index: true
    },
    // Linking
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    user: { // If user generated
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    // Multimedia Fields
    media: [{
        type: { type: String, enum: ['image', 'video'] },
        url: { type: String, required: true },
        alt: String
    }],

    // Poll Fields
    poll: {
        question: String,
        options: [{
            text: String,
            votes: { type: Number, default: 0 }
        }],
        totalVotes: { type: Number, default: 0 },
        expiresAt: Date
    },

    // Analytics
    stats: {
        views: { type: Number, default: 0 },
        likes: { type: Number, default: 0 },
        shares: { type: Number, default: 0 },
        comments: { type: Number, default: 0 },
        completionRate: { type: Number, default: 0 }
    },
    meta: {
        duration: Number,
        channelName: String,
        thumbnailUrl: String,
    },
    archivedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

streamPostSchema.index({ status: 1, category: 1, createdAt: -1 });

export const StreamPost = mongoose.models.StreamPost || mongoose.model('StreamPost', streamPostSchema);
