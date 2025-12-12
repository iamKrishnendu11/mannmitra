// controllers/relaxationAudio.controller.js
import RelaxetionAudio from '../models/relaxetionAudio.model.js';
import path from 'path';
import fs from 'fs';

export const createTrack = async (req, res) => {
  try {
    const { title, description = '', duration_seconds = 0, coins_reward = 0, is_premium = false, tags } = req.body;
    if (!title || (!req.file && !req.body.audio_url && !req.body.audio_url_remote)) {
      return res.status(400).json({ message: 'title and audio are required' });
    }

    const audio = new RelaxetionAudio({
      title,
      description,
      duration_seconds: Number(duration_seconds) || 0,
      duration_minutes: Math.round((Number(duration_seconds) || 0) / 60),
      coins_reward: Number(coins_reward) || 0,
      is_premium: Boolean(is_premium === 'true' || is_premium === true),
      tags: tags ? (Array.isArray(tags) ? tags : String(tags).split(',').map(t => t.trim())) : []
    });

    // if file uploaded via multer -> store local url
    if (req.file) {
      audio.audio_url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    } else if (req.body.audio_url_remote) {
      audio.audio_url = req.body.audio_url_remote;
    } else if (req.body.audio_url) {
      audio.audio_url = req.body.audio_url; // allow absolute url too
    }

    // optional thumbnail upload
    if (req.files?.thumbnail?.[0]) {
      const t = req.files.thumbnail[0];
      audio.thumbnail_url = `${req.protocol}://${req.get('host')}/uploads/${t.filename}`;
    } else if (req.body.thumbnail_url) {
      audio.thumbnail_url = req.body.thumbnail_url;
    }

    await audio.save();
    res.status(201).json(audio);
  } catch (err) {
    console.error('createTrack error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const listTracks = async (req, res) => {
  try {
    const { limit = 50, q, tag } = req.query;
    const filter = {};
    if (q) filter.$or = [
      { title: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
      { tags: { $in: [new RegExp(q, 'i')] } }
    ];
    if (tag) filter.tags = tag;
    const tracks = await RelaxetionAudio.find(filter).sort({ createdAt: -1 }).limit(Number(limit));
    res.json(tracks);
  } catch (err) {
    console.error('listTracks error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getTrack = async (req, res) => {
  try {
    const track = await RelaxetionAudio.findById(req.params.id);
    if (!track) return res.status(404).json({ message: 'Not found' });
    res.json(track);
  } catch (err) {
    console.error('getTrack error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateTrack = async (req, res) => {
  try {
    const track = await RelaxetionAudio.findById(req.params.id);
    if (!track) return res.status(404).json({ message: 'Not found' });

    const body = req.body;
    if (body.title) track.title = body.title;
    if (body.description) track.description = body.description;
    if (body.duration_seconds) {
      track.duration_seconds = Number(body.duration_seconds);
      track.duration_minutes = Math.round(track.duration_seconds / 60);
    }
    if (typeof body.is_premium !== 'undefined') track.is_premium = Boolean(body.is_premium === 'true' || body.is_premium === true);
    if (body.coins_reward) track.coins_reward = Number(body.coins_reward) || 0;
    if (body.tags) track.tags = Array.isArray(body.tags) ? body.tags : String(body.tags).split(',').map(t => t.trim());

    if (req.file) {
      // replace audio file local
      if (track.audio_url && track.audio_url.includes('/uploads/')) {
        try {
          const old = track.audio_url.split('/uploads/').pop();
          const oldPath = path.resolve(process.cwd(), 'uploads', old);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        } catch (e) { /* ignore */ }
      }
      track.audio_url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    if (req.files?.thumbnail?.[0]) {
      if (track.thumbnail_url && track.thumbnail_url.includes('/uploads/')) {
        try {
          const old = track.thumbnail_url.split('/uploads/').pop();
          const oldPath = path.resolve(process.cwd(), 'uploads', old);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        } catch (e) { /* ignore */ }
      }
      track.thumbnail_url = `${req.protocol}://${req.get('host')}/uploads/${req.files.thumbnail[0].filename}`;
    }

    track.updatedAt = new Date();
    await track.save();
    res.json(track);
  } catch (err) {
    console.error('updateTrack error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteTrack = async (req, res) => {
  try {
    const track = await RelaxetionAudio.findById(req.params.id);
    if (!track) return res.status(404).json({ message: 'Not found' });

    // delete local files if applicable
    try {
      if (track.audio_url && track.audio_url.includes('/uploads/')) {
        const filename = track.audio_url.split('/uploads/').pop();
        const filepath = path.resolve(process.cwd(), 'uploads', filename);
        if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
      }
      if (track.thumbnail_url && track.thumbnail_url.includes('/uploads/')) {
        const filename = track.thumbnail_url.split('/uploads/').pop();
        const filepath = path.resolve(process.cwd(), 'uploads', filename);
        if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
      }
    } catch (e) {
      console.warn('failed to cleanup files', e.message);
    }

    await track.remove();
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('deleteTrack error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const likeTrack = async (req, res) => {
  try {
    const track = await RelaxetionAudio.findById(req.params.id);
    if (!track) return res.status(404).json({ message: 'Not found' });

    const userId = req.user._id;
    const liked = track.likedBy?.some(id => id.toString() === userId.toString());
    if (liked) {
      track.likedBy = track.likedBy.filter(id => id.toString() !== userId.toString());
      track.likes = Math.max(0, (track.likes || 1) - 1);
    } else {
      track.likedBy = track.likedBy || [];
      track.likedBy.push(userId);
      track.likes = (track.likes || 0) + 1;
    }
    await track.save();
    res.json({ likes: track.likes, liked: !liked });
  } catch (err) {
    console.error('likeTrack error', err);
    res.status(500).json({ message: 'Server error' });
  }
};
