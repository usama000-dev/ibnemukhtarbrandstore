import mongoose from 'mongoose';

const voiceQuestionSchema = new mongoose.Schema({
    transcript: {
        type: String,
        required: true,
        index: true
    },
    intentType: {
        type: String,
        enum: ['question', 'page_route', 'search', 'cart', 'checkout', 'navigate', 'learned', 'other'],
        required: true
    },
    matchedResponse: {
        type: String,
        default: null
    },
    actionTaken: {
        type: {
            type: String,
            enum: ['navigate', 'search', 'addCart', 'checkout', 'speak']
        },
        payload: mongoose.Schema.Types.Mixed
    },
    userFeedback: {
        type: Boolean,
        default: null
    },
    similarityScore: {
        type: Number,
        default: 0
    },
    adminReviewed: {
        type: Boolean,
        default: false
    },
    learnedPattern: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

voiceQuestionSchema.index({ transcript: 'text' });

const VoiceQuestion = mongoose.models.VoiceQuestion || mongoose.model('VoiceQuestion', voiceQuestionSchema);

export default VoiceQuestion;
