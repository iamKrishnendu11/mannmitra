// seed.audio.js
import mongoose from 'mongoose';
import RelaxationAudio from './models/relaxetionAudio.model.js';
import dotenv from 'dotenv';
dotenv.config();

const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/yourdb';

const SAMPLE_TRACKS = [
  {
    title: 'Focus & Concentration',
    description: 'Binaural beats to enhance mental clarity and focus.',
    duration_seconds: 30 * 60,
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    thumbnail_url: '/mnt/data/Screenshot 2025-11-22 022719.png',
    coins_reward: 5,
    is_premium: false,
    tags: ['focus','binaural']
  },
  {
    title: 'Ocean Waves for Sleep',
    description: 'Gentle ocean sounds to help you drift into peaceful sleep.',
    duration_seconds: 60 * 60,
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    thumbnail_url: '/mnt/data/Screenshot 2025-11-22 022719.png',
    coins_reward: 10,
    is_premium: true,
    tags: ['sleep','nature']
  },
  {
    title: 'Forest Rain Sounds',
    description: 'Soothing rainfall in a peaceful forest setting.',
    duration_seconds: 45 * 60,
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    thumbnail_url: '/mnt/data/Screenshot 2025-11-22 022719.png',
    coins_reward: 7,
    is_premium: false,
    tags: ['nature','rain']
  }
];

async function seed() {
  await mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('connected to mongo');
  await RelaxationAudio.deleteMany({});
  const created = await RelaxationAudio.insertMany(SAMPLE_TRACKS.map(t => ({
    ...t,
    duration_minutes: Math.round((t.duration_seconds || 0) / 60)
  })));
  console.log('seeded', created.length);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
