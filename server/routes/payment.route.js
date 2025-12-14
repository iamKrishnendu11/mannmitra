// backend/routes/payments.route.js
import express from 'express';
import { instantUpgrade } from '../controllers/payment.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';


const router = express.Router();

router.post('/instant-upgrade', requireAuth, instantUpgrade);

export default router;
