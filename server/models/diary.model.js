// models/diary.model.js
import mongoose from 'mongoose';

const DiarySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, default: '' },
  content: { type: String, required: true },
  mood: {
    type: String,
    enum: ['happy', 'calm', 'anxious', 'sad', 'stressed', 'grateful', 'hopeful'],
    default: 'calm'
  },
  entry_date: { type: Date, default: Date.now },
  is_private: { type: Boolean, default: true },
  gratitude_items: [{ type: String }],
  audioUrl: { type: String, default: null }
}, { timestamps: true });

DiarySchema.index({ user: 1, entry_date: -1 });

export default mongoose.model('DiaryEntry', DiarySchema);
