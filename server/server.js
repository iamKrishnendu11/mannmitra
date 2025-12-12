// server.js — put this exactly at the project entry (where you run node)
import "dotenv/config"; // ← MUST be first so env is available to all imports

import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import mentalRoutes from './routes/mentalHealthReport.route.js';
import chatRouter from './routes/chat.route.js';
import authRoutes from './routes/auth.route.js';
import progressRoutes from './routes/userProgress.route.js';
import cookieParser from "cookie-parser";
import paymentsRoutes from './routes/payment.route.js';
import classesRoute from './routes/classes.route.js';
import diaryRoutes from './routes/diary.route.js';
import communityRoutes from './routes/community.route.js';

import relaxetionAudioRoutes from './routes/relaxetionAudio.route.js';

// Import the cached model inspector
import { __getCachedModel } from './utils/gemini.js';

const app = express();
const port = process.env.PORT || 3000;

await connectDB(); // OK if you run Node with ESM and top-level await enabled

// middleware
app.use(express.json());
app.use(cookieParser());

//cors
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({
  origin: CLIENT_URL,     // must be exact origin when using credentials
  credentials: true,      // allow cookies to be sent
  methods: ['GET','POST','PUT','DELETE','OPTIONS']
}));

// api routes
app.get('/', (req, res) => res.send('Server is running'));
app.use("/api/mentalhealth", mentalRoutes);
app.use("/api/chat", chatRouter);
app.use('/api/auth', authRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/diary', diaryRoutes);
app.use('/api/classes', classesRoute);
app.use('/api/community', communityRoutes);
app.use('/api/audio', relaxetionAudioRoutes);

// debug route to inspect cached model (server-only)
app.get('/api/debug/gemini', (req, res) => {
  try {
    const cached = __getCachedModel?.() || null;
    return res.json({ cachedModel: cached, time: new Date().toISOString() });
  } catch (err) {
    return res.status(500).json({ error: "debug_failed", details: err?.message || String(err) });
  }
});

console.log("server starting — GEMINI:", !!process.env.GEMINI_API_KEY);

app.listen(port, () => console.log(`Server is running on port ${port}`));
