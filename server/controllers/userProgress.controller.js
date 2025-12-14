// controllers/userProgress.controller.js
import UserProgress from '../models/userProgress.model.js';
import User from '../models/user.model.js';
import YogaClass from '../models/class.model.js';

const isToday = (date) => {
  if (!date) return false;
  const today = new Date();
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
};

// --- HELPER: Check if a date was yesterday ---
const isYesterday = (date) => {
  if (!date) return false;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return date.getDate() === yesterday.getDate() &&
         date.getMonth() === yesterday.getMonth() &&
         date.getFullYear() === yesterday.getFullYear();
};

// --- HELPER: Ensure daily_tracking exists to prevent crashes ---
const ensureDailyTracking = (progress) => {
  if (!progress.daily_tracking) {
    progress.daily_tracking = {
      community_coins_earned: 0,
      diary_coins_earned: 0,
      last_login_reward_date: null,
      community_last_date: null,
      diary_last_date: null
    };
  }
  return progress;
};

// --- HELPER: Add Transaction to History ---
const addHistory = (progress, type, amount, description) => {
  if (!progress.history) progress.history = [];
  
  progress.history.push({
    type,      
    amount,
    description,
    date: new Date()
  });

  if (progress.history.length > 50) {
    progress.history = progress.history.slice(-50);
  }
};


export const createProgress = async (req, res) => {
  try {
    const { user_email, ...rest } = req.body;
    if (!user_email) return res.status(400).json({ message: 'user_email required' });

    const existing = await UserProgress.findOne({ user_email });
    if (existing) return res.status(400).json({ message: 'Progress already exists' });

    const user = await User.findOne({ email: user_email });
    const progress = new UserProgress({ user_email, user: user?._id, ...rest });
    ensureDailyTracking(progress);
    await progress.save();
    return res.json(progress);
  } catch (err) {
    console.error('createProgress error', err);
    return res.status(500).json({ message: 'Server error' });
  }
};


export const getProgress = async (req, res) => {
  try {
    const { user_email } = req.query;
    let progress = null;

    if (user_email) {
      progress = await UserProgress.findOne({ user_email });
    } else if (req.user) {
      progress = await UserProgress.findOne({ user: req.user._id });
    }

    if (!progress) {
      if (!user_email && !req.user) {
        const list = await UserProgress.find({}).lean();
        return res.json(list);
      }
      return res.json(null);
    }

    ensureDailyTracking(progress);

    // 2. --- STREAK LOGIC ---
    const lastLogin = progress.last_login_date ? new Date(progress.last_login_date) : null;
    
    // Check if this is a "new" login day
    if (!isToday(lastLogin)) {
      if (isYesterday(lastLogin)) {
        // Logged in yesterday -> Increment Streak
        progress.current_streak = (progress.current_streak || 0) + 1;
      } else {
        // Missed a day or never logged in -> Reset to 1
        progress.current_streak = 1;
      }
      
      // Update last login to now
      progress.last_login_date = new Date();
      
      // Save immediately to lock in the streak
      await progress.save();
    }

    // 3. --- DAILY LOGIN REWARD LOGIC (Premium Only) ---
    // Rule: 1 coin per day
    if (progress.subscription_status === 'premium') {
      const lastReward = progress.daily_tracking?.last_login_reward_date 
        ? new Date(progress.daily_tracking.last_login_reward_date) 
        : null;
      
      if (!isToday(lastReward)) {
        progress.coins = (progress.coins || 0) + 1;
        progress.daily_tracking.last_login_reward_date = new Date();
        
        // LOG HISTORY
        addHistory(progress, 'earned', 1, 'Daily Login Bonus');
        
        await progress.save();
      }
    }

    return res.json(progress);
  } catch (err) {
    console.error('getProgress error', err);
    return res.status(500).json({ message: 'Server error' });
  }
};


export const updateProgress = async (req, res) => {
  try {
    const id = req.params.id;
    const update = req.body;
    const progress = await UserProgress.findById(id);
    if (!progress) return res.status(404).json({ message: 'Not found' });

    if (req.user && progress.user && String(progress.user) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    Object.assign(progress, update);
    await progress.save();
    return res.json(progress);
  } catch (err) {
    console.error('updateProgress error', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const updateByEmail = async (req, res) => {
  try {
    const { user_email } = req.params;
    const update = req.body;
    const progress = await UserProgress.findOne({ user_email });
    if (!progress) return res.status(404).json({ message: 'Not found' });

    if (req.user && String(progress.user) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    Object.assign(progress, update);
    await progress.save();
    return res.json(progress);
  } catch (err) {
    console.error('updateByEmail error', err);
    return res.status(500).json({ message: 'Server error' });
  }
};


export const completeClass = async (req, res) => {
  try {
    const userId = req.user && (req.user._id || req.user.id);
    const { classId, coinsReward: providedCoins } = req.body;

    if (!classId) return res.status(400).json({ message: 'classId is required' });
    if (!userId) return res.status(401).json({ message: 'Unauthenticated' });

    const classDoc = await YogaClass.findById(classId).lean();
    if (!classDoc) return res.status(404).json({ message: 'Class not found' });

    let progress = await UserProgress.findOne({ user: userId });
    
    if (!progress) {
      progress = new UserProgress({
        user_email: req.user.email,
        user: userId,
        subscription_status: 'free' 
      });
    }

    ensureDailyTracking(progress);

    if (progress.completed_classes.includes(classId)) {
      return res.status(400).json({ message: 'Class already completed', progress });
    }

    progress.completed_classes.push(classId);

    if (progress.subscription_status === 'premium') {
      let coinsToAdd = Number(providedCoins) || classDoc.coins_reward || 0;
      progress.coins = (progress.coins || 0) + coinsToAdd;
      
      // LOG HISTORY
      if (coinsToAdd > 0) {
        addHistory(progress, 'earned', coinsToAdd, `Class Completed: ${classDoc.title || 'Yoga Session'}`);
      }
    }

    await progress.save();
    return res.json({ message: 'Class completed', progress });

  } catch (err) {
    console.error('completeClass error', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const redeemReward = async (req, res) => {
  try {
    const userId = req.user._id; 
    const { itemId, cost, itemName } = req.body;

    if (!itemId || !cost) {
      return res.status(400).json({ message: 'Item ID and cost are required' });
    }

    const progress = await UserProgress.findOne({ user: userId });
    
    if (!progress) {
      return res.status(404).json({ message: 'User progress not found' });
    }


    if (!progress.redeemed_rewards) {
        progress.redeemed_rewards = [];
    }

    // 1. Check if already owned
    if (progress.redeemed_rewards.includes(itemId)) {
      return res.status(400).json({ message: 'You already own this item!' });
    }

    // 2. Check Balance
    if ((progress.coins || 0) < cost) {
      return res.status(400).json({ message: `Insufficient coins. You need ${cost} coins.` });
    }

    // 3. Process Transaction
    progress.coins -= cost;
    progress.redeemed_rewards.push(itemId);
    
    // LOG HISTORY
    addHistory(progress, 'redeemed', cost, `Redeemed: ${itemName}`);
    
    await progress.save();
    return res.json({ 
      success: true, 
      message: `Redeemed ${itemName || 'item'} successfully!`,
      progress
    });

  } catch (err) {
    console.error('redeemReward error', err);
    return res.status(500).json({ message: 'Server error during redemption' });
  }
};

export const awardCommunityCoins = async (userId) => {
  try {
    const progress = await UserProgress.findOne({ user: userId });
    
    if (!progress || progress.subscription_status !== 'premium') return;
    ensureDailyTracking(progress);

    const lastDate = progress.daily_tracking.community_last_date ? new Date(progress.daily_tracking.community_last_date) : null;
    if (!isToday(lastDate)) {
      progress.daily_tracking.community_coins_earned = 0;
      progress.daily_tracking.community_last_date = new Date();
    }

    // 4. Check Cap (10 coins max)
    if (progress.daily_tracking.community_coins_earned < 10) {
      const reward = 5;
      progress.coins = (progress.coins || 0) + reward;
      progress.daily_tracking.community_coins_earned += reward;
      
      // LOG HISTORY
      addHistory(progress, 'earned', reward, 'Community Post Reward');
      
      await progress.save();
      console.log(`Community Reward: Awarded 5 coins. Total today: ${progress.daily_tracking.community_coins_earned}`);
    }
  } catch (err) {
    console.error('Error awarding community coins:', err);
  }
};


export const awardDiaryCoins = async (userId) => {
  try {
    const progress = await UserProgress.findOne({ user: userId });
    
    if (!progress || progress.subscription_status !== 'premium') return;

    ensureDailyTracking(progress);

    // Reset if new day
    const lastDate = progress.daily_tracking.diary_last_date ? new Date(progress.daily_tracking.diary_last_date) : null;
    if (!isToday(lastDate)) {
      progress.daily_tracking.diary_coins_earned = 0;
      progress.daily_tracking.diary_last_date = new Date();
    }

    // Check Cap
    if (progress.daily_tracking.diary_coins_earned < 10) {
      const reward = 5; 
      progress.coins = (progress.coins || 0) + reward;
      progress.daily_tracking.diary_coins_earned += reward;
      progress.diary_entries_count = (progress.diary_entries_count || 0) + 1;
      
      // LOG HISTORY
      addHistory(progress, 'earned', reward, 'Diary Entry Reward');
      
      await progress.save();
      console.log(`Diary Reward: Awarded 5 coins. Total today: ${progress.daily_tracking.diary_coins_earned}`);
    }
  } catch (err) {
    console.error('Error awarding diary coins:', err);
  }
};