// server/routes/relaxationAudio.routes.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { requireAuth } from '../middlewares/auth.middleware.js';

import {
  createTrack,
  listTracks,
  getTrack,
  updateTrack,
  deleteTrack,
  likeTrack
} from '../controllers/relaxetionAudio.controller.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, '..', 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '';
    const base = `${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
    cb(null, `${base}${ext}`);
  }
});
const upload = multer({ storage, limits: { fileSize: 100 * 1024 * 1024 } }); 

const router = express.Router();

// endpoints
router.get('/', listTracks);
router.post('/', requireAuth, upload.single('audio'), createTrack); 
router.get('/:id', requireAuth, getTrack);
router.put('/:id', requireAuth, upload.single('audio'), updateTrack);
router.delete('/:id', requireAuth, deleteTrack);
router.post('/:id/like', requireAuth, likeTrack);

export default router;
