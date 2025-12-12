// routes/community.route.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import { requireAuth } from '../middlewares/auth.middleware.js';
import {
  createPost,
  listPosts,
  getPost,
  updatePost,
  deletePost,
  likePost,
  commentPost
} from '../controllers/community.controller.js';

const router = express.Router();

// multer setup for local storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // ensure 'uploads' folder exists or adjust path as needed
    const uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = `${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
    cb(null, `${base}${ext}`);
  }
});

const upload = multer({ 
  storage, 
  limits: { fileSize: 30 * 1024 * 1024 } // 30MB limit
});

// --- ROUTES ---

// Public list, but actions require auth
router.get('/', requireAuth, listPosts); 
router.post('/', requireAuth, upload.single('media'), createPost); 

router.get('/:id', requireAuth, getPost);
router.put('/:id', requireAuth, upload.single('media'), updatePost);
router.delete('/:id', requireAuth, deletePost);

router.post('/:id/like', requireAuth, likePost);
router.post('/:id/comment', requireAuth, commentPost);

export default router;