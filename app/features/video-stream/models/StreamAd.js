import mongoose from 'mongoose';

const streamAdSchema = new mongoose.Schema({
    title: { type: String, required: true },
    videoUrl: { type: String, required: true }, // Cloudinary URL
    ctaText: { type: String, default: 'Learn More' }, // e.g. "Shop Now", "Call Us"
    ctaLink: { type: String, default: '#' }, // URL or tel: protocol
    ctaType: { type: String, enum: ['link', 'call', 'whatsapp'], default: 'link' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    views: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
}, { timestamps: true });

export const StreamAd = mongoose.models.StreamAd || mongoose.model('StreamAd', streamAdSchema);
