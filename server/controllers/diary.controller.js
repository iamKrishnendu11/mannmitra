// controllers/diary.controller.js
import DiaryEntry from '../models/diary.model.js';
import path from 'path';
import fs from 'fs';
import { awardDiaryCoins } from './userProgress.controller.js';

export const createEntry = async (req, res) => {
  try {
    const {
      title = '',
      content,
      mood = 'calm',
      entry_date,
      is_private = 'true',
      gratitude_items = '[]'
    } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'content is required' });
    }

    const entry = new DiaryEntry({
      user: req.user._id,
      title,
      content,
      mood,
      entry_date: entry_date ? new Date(entry_date) : Date.now(),
      is_private: (is_private === true || is_private === 'true'),
      gratitude_items: Array.isArray(gratitude_items) ? gratitude_items : JSON.parse(gratitude_items || '[]')
    });

    if (req.file) {
      entry.audioUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    await entry.save();

    // --- REWARD LOGIC ---
    awardDiaryCoins(req.user._id);

    return res.status(201).json(entry);
  } catch (err) {
    console.error('createEntry error', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const listEntries = async (req, res) => {
  try {
    const { limit = 50, sort = '-entry_date', q, mood } = req.query;

    const filter = { user: req.user._id };

    if (typeof req.query.is_private !== 'undefined') {
      filter.is_private = req.query.is_private === 'true';
    }

    if (mood) filter.mood = mood;
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } }
      ];
    }

    const entries = await DiaryEntry.find(filter)
      .sort(sort)
      .limit(Number(limit));

    return res.json(entries);
  } catch (err) {
    console.error('listEntries error', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const entry = await DiaryEntry.findById(id);
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    if (entry.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Forbidden' });
    return res.json(entry);
  } catch (err) {
    console.error('getEntry error', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const updateEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const entry = await DiaryEntry.findById(id);
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    if (entry.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Forbidden' });

    const {
      title,
      content,
      mood,
      entry_date,
      is_private,
      gratitude_items
    } = req.body;

    if (typeof title !== 'undefined') entry.title = title;
    if (typeof content !== 'undefined') entry.content = content;
    if (typeof mood !== 'undefined') entry.mood = mood;
    if (typeof entry_date !== 'undefined') entry.entry_date = new Date(entry_date);
    if (typeof is_private !== 'undefined') entry.is_private = (is_private === true || is_private === 'true');
    if (typeof gratitude_items !== 'undefined') {
      entry.gratitude_items = Array.isArray(gratitude_items) ? gratitude_items : JSON.parse(gratitude_items || '[]');
    }

    if (req.file) {
      if (entry.audioUrl && entry.audioUrl.includes('/uploads/')) {
        try {
          const filename = entry.audioUrl.split('/uploads/').pop();
          const filepath = path.resolve(process.cwd(), 'uploads', filename);
          if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
        } catch (e) {
          console.warn('failed to remove old audio', e.message);
        }
      }
      entry.audioUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    await entry.save();
    return res.json(entry);
  } catch (err) {
    console.error('updateEntry error', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const deleteEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const entry = await DiaryEntry.findById(id);
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    if (entry.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Forbidden' });

    // delete audio file if local
    if (entry.audioUrl && entry.audioUrl.includes('/uploads/')) {
      try {
        const filename = entry.audioUrl.split('/uploads/').pop();
        const filepath = path.resolve(process.cwd(), 'uploads', filename);
        if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
      } catch (e) {
        console.warn('failed to remove audio during delete', e.message);
      }
    }

    // --- FIX FOR DEPRECATED METHOD ---
    await DiaryEntry.deleteOne({ _id: entry._id });
    
    return res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('deleteEntry error', err);
    return res.status(500).json({ message: 'Server error' });
  }
};