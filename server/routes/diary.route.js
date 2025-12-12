// routes/diary.routes.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import { requireAuth } from '../middlewares/auth.middleware.js'; // use your existing auth middleware
import {
  createEntry,
  listEntries,
  getEntry,
  updateEntry,
  deleteEntry
} from '../controllers/diary.controller.js';

const router = express.Router();

// Multer local storage (uploads dir should be served static in your server)
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
const upload = multer({ storage, limits: { fileSize: 15 * 1024 * 1024 } }); // 15MB limit

// All diary routes are private: require auth. If you want to gate by premium, add requirePremium middleware.
router.get('/', requireAuth, listEntries);            // GET /api/diary
router.post('/', requireAuth, upload.single('audio'), createEntry); // POST /api/diary (formData or JSON)
router.get('/:id', requireAuth, getEntry);            // GET /api/diary/:id
router.put('/:id', requireAuth, upload.single('audio'), updateEntry); // PUT /api/diary/:id
router.delete('/:id', requireAuth, deleteEntry);      // DELETE /api/diary/:id
export default router;
