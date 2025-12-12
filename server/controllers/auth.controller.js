// controllers/auth.controller.js
// Modified logout to reliably clear the refresh cookie (match the attributes used when setting it)
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import UserProgress from '../models/userProgress.model.js';
import dotenv from 'dotenv';
dotenv.config();

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES_IN || '15m';
const REFRESH_EXPIRES = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

function signAccessToken(user) {
  return jwt.sign({ id: user._id }, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES });
}
function signRefreshToken(user) {
  return jwt.sign({ id: user._id }, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES });
}

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = new User({ name, email, password: hashed });
    await user.save();

    // create default progress doc
    const progress = new UserProgress({ user: user._id, user_email: user.email });
    await progress.save();

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    // Set cookie for refresh token. Use same settings in refresh and logout.
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7
    });

    return res.json({
      user: { id: user._id, name: user.name, email: user.email },
      accessToken
    });
  } catch (err) {
    console.error('REGISTER ERROR:', err && err.stack ? err.stack : err);
    if (process.env.NODE_ENV !== 'production') {
      return res.status(500).json({ message: err.message || 'Server error', stack: err.stack });
    }
    return res.status(500).json({ message: 'Server error' });
  }
};


export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7
    });

    return res.json({
      user: { id: user._id, name: user.name, email: user.email },
      accessToken
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// --- NEW: logout that reliably clears cookie using same attributes/path ---
export const logout = async (req, res) => {
  try {
    // Clear the refresh token cookie with the same path/sameSite/secure attrs used to set it.
    // Using sameSite:'none' and path:'/' prevents the browser from keeping the cookie.
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      path: '/'
    });
    return res.json({ message: 'Logged out' });
  } catch (err) {
    console.error('logout error', err && err.stack ? err.stack : err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const refreshToken = async (req, res) => {
  try {
    console.log('[REFRESH] req.cookies =', req.cookies); // debug

    const token = req.cookies?.refreshToken;
    if (!token) {
      console.log('[REFRESH] no refresh token cookie present');
      return res.status(401).json({ message: 'No refresh token' });
    }

    let payload;
    try {
      payload = jwt.verify(token, REFRESH_SECRET);
    } catch (jwtErr) {
      console.log('[REFRESH] jwt.verify error:', jwtErr.message);
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const user = await User.findById(payload.id).select('-password');
    if (!user) {
      console.log('[REFRESH] user not found for id:', payload.id);
      return res.status(401).json({ message: 'User not found' });
    }

    const accessToken = signAccessToken(user);
    const refresh = signRefreshToken(user);

    res.cookie('refreshToken', refresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7
    });

    console.log('[REFRESH] success, returning new access token for', user.email);
    return res.json({ user: { id: user._id, name: user.name, email: user.email }, accessToken });
  } catch (err) {
    console.error('[REFRESH ERROR]', err && err.stack ? err.stack : err);
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
};


export const me = async (req, res) => {
  try {
    const user = req.user;
    const progress = await UserProgress.findOne({ user: user._id }).lean();
    return res.json({ user, progress });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
