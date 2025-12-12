// models/community.model.js
import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userName: { type: String },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, { _id: true });

const CommunityPostSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  authorName: { type: String, required: true },
  title: { type: String, default: '' },
  content: { type: String, required: true },
  post_type: { type: String, enum: ['story','achievement','support','inspiration'], default: 'story' },
  media_url: { type: String, default: null },
  media_type: { type: String, enum: ['image','video','none'], default: 'none' },
  likes: { type: Number, default: 0 },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // optional
  comments: [CommentSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

CommunityPostSchema.index({ createdAt: -1 });

export default mongoose.model('CommunityPost', CommunityPostSchema);
