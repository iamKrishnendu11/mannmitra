// routes/userProgress.route.js
import express from 'express';
import {
  createProgress,
  getProgress,
  updateProgress,
  updateByEmail,
  completeClass,
  redeemReward // <--- IMPORT THIS
} from '../controllers/userProgress.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Existing routes
router.post('/', requireAuth, createProgress); 
router.get('/', getProgress); 
router.put('/:id', requireAuth, updateProgress);
router.put('/email/:user_email', requireAuth, updateByEmail);

// Atomic complete endpoint (for classes)
router.post('/complete', requireAuth, completeClass);

// --- NEW: Redeem Reward Endpoint ---
// This connects the "Redeem" button in your frontend to the backend logic
router.post('/redeem', requireAuth, redeemReward);

export default router;