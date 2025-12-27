import mongoose from 'mongoose';
import { User } from '@/models/User';

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
  },
  slug: {
    type: String,
    required: true,
    trim: true,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  featuredImage: {
    url: {
      type: String,
      required: [true, 'Featured image URL is required'],
    },
    publicId: {
      type: String,
      required: [true, 'Featured image public ID is required'],
    },
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  views: {
    type: Number,
    default: 0,
  },
});

// Update the updatedAt timestamp before saving
blogPostSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Create indexes for better query performance
blogPostSchema.index({ title: 'text', content: 'text' });
blogPostSchema.index({ tags: 1 });
blogPostSchema.index({ slug: 1 }, { unique: true });
blogPostSchema.index({ createdAt: -1 });

const BlogPost = mongoose.models.BlogPost || mongoose.model('BlogPost', blogPostSchema);

export default BlogPost; 