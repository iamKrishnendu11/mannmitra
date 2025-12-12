// models/relaxationAudio.model.js
import mongoose from 'mongoose';

const RelaxetionAudioSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  duration_seconds: { type: Number, default: 0 }, // store seconds
  duration_minutes: { type: Number, default: 0 },
  audio_url: { type: String, required: true }, // absolute or relative URL
  thumbnail_url: { type: String, default: null },
  type: { type: String, default: 'audio' },
  tags: [{ type: String }],
  coins_reward: { type: Number, default: 0 },
  is_premium: { type: Boolean, default: false },
  likes: { type: Number, default: 0 },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

RelaxetionAudioSchema.index({ createdAt: -1 });

export default mongoose.model('RelaxetionAudio', RelaxetionAudioSchema);
