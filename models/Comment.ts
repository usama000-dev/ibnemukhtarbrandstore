import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  blogPostId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  comment: string;
  postSlug: string;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema({
  blogPostId: {
    type: Schema.Types.ObjectId,
    ref: 'BlogPost',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
  },
  comment: {
    type: String,
    required: [true, 'Comment text is required'],
    trim: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema); 