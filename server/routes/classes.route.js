// routes/classes.route.js
import express from 'express';
import {
  listClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass
} from '../controllers/classes.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = express.Router();
router.get('/', listClasses);
router.get('/:id', getClassById);
router.post('/', requireAuth, createClass);
router.put('/:id', requireAuth, updateClass);
router.delete('/:id', requireAuth, deleteClass);

export default router;
