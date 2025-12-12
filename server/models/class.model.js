// models/class.model.js
import mongoose from 'mongoose';

const YogaClassSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  type: {
    type: String,
    enum: ['yoga', 'meditation', 'breathing', 'mindfulness'],
    required: true,
  },
  duration_minutes: { type: Number, required: true },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner',
  },
  video_url: { type: String, default: '' },
  thumbnail_url: { type: String, default: '' },
  instructor: { type: String, default: '' },
  coins_reward: { type: Number, default: 10 },
  created_date: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('YogaClass', YogaClassSchema);
