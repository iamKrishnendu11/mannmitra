// backend/controllers/payments.controller.js
import UserProgress from '../models/userProgress.model.js';
import dotenv from 'dotenv';
dotenv.config();

// Grant premium to currently authenticated user (DEV / no payment)
export const instantUpgrade = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    const userEmail = req.user && req.user.email;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
    const newEndDate = new Date(Date.now() + thirtyDaysMs);

    let progress = await UserProgress.findOne({ user: userId });
    if (!progress) {
      progress = new UserProgress({
        user: userId,
        user_email: userEmail || '',
        coins: 0,
        current_streak: 0,
        diary_entries_count: 0,
        completed_classes: [],
        subscription_status: 'premium',
        subscription_end_date: newEndDate
      });
    } else {
      progress.subscription_status = 'premium';
      progress.subscription_end_date = newEndDate;
    }
    await progress.save();

    return res.json({ success: true, message: 'Upgraded to premium', progress });
  } catch (err) {
    console.error('[INSTANT UPGRADE ERROR]', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
