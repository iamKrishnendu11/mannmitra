// routes/diary.routes.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import { requireAuth } from '../middlewares/auth.middleware.js';
import {
  createEntry,
  listEntries,
  getEntry,
  updateEntry,
  deleteEntry
} from '../controllers/diary.controller.js';

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = `${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
    cb(null, `${base}${ext}`);
  }
});
const upload = multer({ storage, limits: { fileSize: 15 * 1024 * 1024 } });
router.get('/', requireAuth, listEntries);           
router.post('/', requireAuth, upload.single('audio'), createEntry);
router.get('/:id', requireAuth, getEntry);           
router.put('/:id', requireAuth, upload.single('audio'), updateEntry);
router.delete('/:id', requireAuth, deleteEntry);
export default router;
