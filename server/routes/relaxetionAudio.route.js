// server/routes/relaxationAudio.routes.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { requireAuth } from '../middlewares/auth.middleware.js'; // make sure this path is correct for your project

import {
  createTrack,
  listTracks,
  getTrack,
  updateTrack,
  deleteTrack,
  likeTrack
} from '../controllers/relaxetionAudio.controller.js'; // controller filename must match

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Choose an uploads dir relative to server folder (robust regardless of cwd)
const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, '..', 'uploads');

// ensure directory exists
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '';
    const base = `${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
    cb(null, `${base}${ext}`);
  }
});
const upload = multer({ storage, limits: { fileSize: 100 * 1024 * 1024 } }); // 100MB

const router = express.Router();

// endpoints
router.get('/', listTracks);
router.post('/', requireAuth, upload.single('audio'), createTrack); // field name: 'audio'
router.get('/:id', requireAuth, getTrack);
router.put('/:id', requireAuth, upload.single('audio'), updateTrack);
router.delete('/:id', requireAuth, deleteTrack);
router.post('/:id/like', requireAuth, likeTrack);

export default router;
