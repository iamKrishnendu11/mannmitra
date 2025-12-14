// models/userProgress.model.js
import mongoose from 'mongoose';

const UserProgressSchema = new mongoose.Schema({
  user_email: { type: String, required: true },
  coins: { type: Number, default: 0 },
  current_streak: { type: Number, default: 0 },
  subscription_status: { type: String, enum: ['free', 'premium'], default: 'free' },
  subscription_end_date: { type: Date },

  completed_classes: { type: [String], default: [] },
  diary_entries_count: { type: Number, default: 0 },
  
  redeemed_rewards: { 
    type: [String], 
    default: [] 
  },

  history: [{
    type: { type: String, enum: ['earned', 'redeemed'], required: true },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    date: { type: Date, default: Date.now }
  }],
  
  daily_tracking: {
    last_login_reward_date: { type: Date },
    
    community_coins_earned: { type: Number, default: 0 },
    community_last_date: { type: Date },
    diary_coins_earned: { type: Number, default: 0 },
    diary_last_date: { type: Date }
  },

  last_login_date: { type: Date },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

UserProgressSchema.index({ user: 1 }, { unique: true, sparse: true });

export default mongoose.model('UserProgress', UserProgressSchema);