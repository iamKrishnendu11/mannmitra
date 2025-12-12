// models/userProgress.model.js
import mongoose from 'mongoose';

const UserProgressSchema = new mongoose.Schema({
  user_email: { type: String, required: true },
  
  // Core Stats
  coins: { type: Number, default: 0 },
  current_streak: { type: Number, default: 0 },
  
  // Subscription
  subscription_status: { type: String, enum: ['free', 'premium'], default: 'free' },
  subscription_end_date: { type: Date },

  // Activity Tracking
  completed_classes: { type: [String], default: [] },
  diary_entries_count: { type: Number, default: 0 },
  
  // --- NEW: Store Claimed Rewards ---
  // Stores IDs of items user has bought (e.g., ['r_pen', 'r_notebook'])
  redeemed_rewards: { 
    type: [String], 
    default: [] 
  },

  // --- NEW: Transaction History ---
  // Logs every coin change for the history popup
  history: [{
    type: { type: String, enum: ['earned', 'redeemed'], required: true },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    date: { type: Date, default: Date.now }
  }],
  
  // Daily Reward Tracking
  daily_tracking: {
    last_login_reward_date: { type: Date },
    
    // Community: 5 coins per post, max 10 per day
    community_coins_earned: { type: Number, default: 0 },
    community_last_date: { type: Date },

    // Diary: 5 coins per entry, max 10 per day
    diary_coins_earned: { type: Number, default: 0 },
    diary_last_date: { type: Date }
  },

  last_login_date: { type: Date },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

UserProgressSchema.index({ user: 1 }, { unique: true, sparse: true });

export default mongoose.model('UserProgress', UserProgressSchema);