// routes/userProgress.route.js
import express from 'express';
import {
  createProgress,
  getProgress,
  updateProgress,
  updateByEmail,
  completeClass,
  redeemReward
} from '../controllers/userProgress.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', requireAuth, createProgress); 
router.get('/', getProgress); 
router.put('/:id', requireAuth, updateProgress);
router.put('/email/:user_email', requireAuth, updateByEmail);

router.post('/complete', requireAuth, completeClass);

router.post('/redeem', requireAuth, redeemReward);

export default router;