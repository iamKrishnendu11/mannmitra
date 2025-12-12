// routes/classes.route.js
import express from 'express';
import {
  listClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass
} from '../controllers/classes.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js'; // adapt import path to your project

const router = express.Router();

// Public: list & fetch
router.get('/', listClasses);
router.get('/:id', getClassById);

// Protected: create/update/delete — add admin check if desired
router.post('/', requireAuth, createClass);
router.put('/:id', requireAuth, updateClass);
router.delete('/:id', requireAuth, deleteClass);

export default router;
