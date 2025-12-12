// controllers/community.controller.js
import CommunityPost from '../models/community.model.js';
import path from 'path';
import fs from 'fs';
// IMPORT REWARD HELPER
import { awardCommunityCoins } from './userProgress.controller.js';

/**
 * Helper: resolve id whether value is a string or a populated object.
 * Returns trimmed string id or null.
 */
function resolveId(v) {
  if (!v) return null;
  if (typeof v === 'object') {
    const maybe = v._id ?? v.id ?? v._doc?._id ?? v._doc?.id ?? null;
    return maybe ? String(maybe).trim() : null;
  }
  return String(v).trim();
}

export const createPost = async (req, res) => {
  try {
    const { title = '', content, post_type = 'story' } = req.body;
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'content required' });
    }

    const post = new CommunityPost({
      author: req.user._id,
      authorName: req.user.name || req.user.email || 'Anonymous',
      title,
      content,
      post_type
    });

    if (req.file) {
      post.media_url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      post.media_type = req.file.mimetype.startsWith('video/') ? 'video' : 'image';
    }

    await post.save();

    // --- REWARD LOGIC ---
    // Award coins for posting (Premium only, capped daily)
    // We don't await this to keep response fast
    awardCommunityCoins(req.user._id);

    return res.status(201).json(post);
  } catch (err) {
    console.error('createPost error', err && err.stack ? err.stack : err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const listPosts = async (req, res) => {
  try {
    const { limit = 50, q, post_type } = req.query;
    const filter = {};
    if (post_type) filter.post_type = post_type;
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } },
        { authorName: { $regex: q, $options: 'i' } }
      ];
    }
    const posts = await CommunityPost.find(filter).sort({ createdAt: -1 }).limit(Number(limit));
    return res.json(posts);
  } catch (err) {
    console.error('listPosts error', err && err.stack ? err.stack : err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getPost = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    return res.json(post);
  } catch (err) {
    console.error('getPost error', err && err.stack ? err.stack : err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const updatePost = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // authorize: only author can update
    const reqUserId = resolveId(req.user?._id ?? req.user?.id ?? req.user);
    const postAuthorId = resolveId(post.author ?? post.authorId ?? post.user ?? post.createdBy);
    if (!reqUserId) return res.status(401).json({ message: 'Unauthorized' });
    if (postAuthorId && postAuthorId !== reqUserId) return res.status(403).json({ message: 'Forbidden' });

    const { title, content, post_type } = req.body;
    if (typeof title !== 'undefined') post.title = title;
    if (typeof content !== 'undefined') post.content = content;
    if (typeof post_type !== 'undefined') post.post_type = post_type;

    if (req.file) {
      // remove previous local file if present
      if (post.media_url && post.media_url.includes('/uploads/')) {
        try {
          const filename = post.media_url.split('/uploads/').pop();
          const filepath = path.resolve(process.cwd(), 'uploads', filename);
          if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
        } catch (e) {
          console.warn('updatePost: failed to remove old media', e && e.message ? e.message : e);
        }
      }
      post.media_url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      post.media_type = req.file.mimetype.startsWith('video/') ? 'video' : 'image';
    }

    post.updatedAt = new Date();
    await post.save();
    return res.json(post);
  } catch (err) {
    console.error('updatePost error', err && err.stack ? err.stack : err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const reqUserId = resolveId(req.user?._id ?? req.user?.id ?? req.user);
    const postAuthorId = resolveId(post.author ?? post.authorId ?? post.user ?? post.createdBy);

    if (!reqUserId) return res.status(401).json({ message: 'Unauthorized' });
    if (postAuthorId && postAuthorId !== reqUserId) return res.status(403).json({ message: 'Forbidden' });

    if (post.media_url && post.media_url.includes('/uploads/')) {
      try {
        const filename = post.media_url.split('/uploads/').pop();
        const filepath = path.resolve(process.cwd(), 'uploads', filename);
        if (fs.existsSync(filepath)) {
          await fs.promises.unlink(filepath).catch(() => {});
        }
      } catch (e) {
        console.warn('deletePost: error unlinking media', e.message);
      }
    }

    await CommunityPost.deleteOne({ _id: post._id });
    return res.json({ message: 'Post deleted' });
  } catch (err) {
    console.error('deletePost error', err && err.stack ? err.stack : err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const likePost = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const userId = req.user._id;
    const liked = post.likedBy?.some(id => id.toString() === userId.toString());
    if (liked) {
      post.likedBy = post.likedBy.filter(id => id.toString() !== userId.toString());
      post.likes = Math.max(0, (post.likes || 1) - 1);
    } else {
      post.likedBy = post.likedBy || [];
      post.likedBy.push(userId);
      post.likes = (post.likes || 0) + 1;
    }
    await post.save();
    return res.json({ likes: post.likes, liked: !liked });
  } catch (err) {
    console.error('likePost error', err && err.stack ? err.stack : err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// THIS IS THE CRITICAL MISSING FUNCTION
export const commentPost = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ message: 'Comment text required' });

    const post = await CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = {
      userId: req.user._id,
      userName: req.user.name || req.user.email || 'Anonymous',
      text: text.trim()
    };
    post.comments = post.comments || [];
    post.comments.push(comment);
    await post.save();
    return res.status(201).json(comment);
  } catch (err) {
    console.error('commentPost error', err && err.stack ? err.stack : err);
    return res.status(500).json({ message: 'Server error' });
  }
};