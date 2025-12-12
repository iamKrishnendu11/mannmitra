// seed/seedClasses.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import YogaClass from '../models/class.model.js';

dotenv.config();

const CLASSES = [
  {
    title: 'Morning Gentle Yoga',
    description: 'Start your day with gentle stretches and breathing exercises perfect for beginners',
    type: 'yoga',
    duration_minutes: 15,
    difficulty: 'beginner',
    thumbnail_url: '/images/morning-yoga.jpg',
    instructor: 'Priya Sharma',
    coins_reward: 10
  },
  {
    title: 'Mindful Meditation',
    description: 'Calm your mind with guided meditation focusing on breath awareness',
    type: 'meditation',
    duration_minutes: 20,
    difficulty: 'beginner',
    thumbnail_url: '/images/mindful-meditation.jpg',
    instructor: 'Rahul Verma',
    coins_reward: 15
  },
  {
    title: 'Body Scan Meditation',
    description: 'Progressive relaxation technique for deep stress relief',
    type: 'mindfulness',
    duration_minutes: 25,
    difficulty: 'beginner',
    thumbnail_url: '/images/body-scan.jpg',
    instructor: 'Rahul Verma',
    coins_reward: 15
  },
  {
    title: 'Evening Stretch Routine',
    description: 'Release tension before bed with restorative stretches',
    type: 'yoga',
    duration_minutes: 20,
    difficulty: 'beginner',
    thumbnail_url: '/images/evening-stretch.jpg',
    instructor: 'Anjali Rao',
    coins_reward: 12
  },
  {
    title: 'Breathing for Focus',
    description: 'Pranayama exercises to increase concentration and calm',
    type: 'breathing',
    duration_minutes: 10,
    difficulty: 'intermediate',
    thumbnail_url: '/images/breathing-focus.jpg',
    instructor: 'Karan Singh',
    coins_reward: 8
  },
  {
    title: 'Stress Relief Yoga Flow',
    description: 'A soothing vinyasa flow to relieve built-up stress',
    type: 'yoga',
    duration_minutes: 30,
    difficulty: 'intermediate',
    thumbnail_url: '/images/stress-relief.jpg',
    instructor: 'Priya Sharma',
    coins_reward: 20
  },
  {
    title: 'Loving-Kindness Meditation',
    description: 'Cultivate compassion and positive feelings toward self and others',
    type: 'meditation',
    duration_minutes: 18,
    difficulty: 'beginner',
    thumbnail_url: '/images/loving-kindness.jpg',
    instructor: 'Neha Kapoor',
    coins_reward: 12
  },
  {
    title: 'Quick 5-min Reset',
    description: 'Short breathing & movement routine to reset your mood during the day',
    type: 'breathing',
    duration_minutes: 5,
    difficulty: 'beginner',
    thumbnail_url: '/images/quick-reset.jpg',
    instructor: 'Karan Singh',
    coins_reward: 5
  },
  {
    title: 'Deep Relaxation Yoga',
    description: 'Long restorative sequence to deeply relax the nervous system',
    type: 'yoga',
    duration_minutes: 40,
    difficulty: 'advanced',
    thumbnail_url: '/images/deep-relaxation.jpg',
    instructor: 'Anjali Rao',
    coins_reward: 30
  },
  {
    title: 'Mindful Walking',
    description: 'Practice mindfulness while walking — great for outdoors or indoor pacing',
    type: 'mindfulness',
    duration_minutes: 15,
    difficulty: 'beginner',
    thumbnail_url: '/images/mindful-walking.jpg',
    instructor: 'Rahul Verma',
    coins_reward: 10
  },
  {
    title: 'Nature Relaxation (Screenshot Example)',
    description: 'A guided meditation with nature visuals (uses uploaded screenshot as thumbnail)',
    type: 'mindfulness',
    duration_minutes: 22,
    difficulty: 'beginner',
    // developer note: using the uploaded screenshot path here:
    thumbnail_url: '/mnt/data/Screenshot 2025-11-21 202629.png',
    instructor: 'Guest Instructor',
    coins_reward: 15
  }
];

async function seed() {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mannmitra';
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    await YogaClass.deleteMany({});
    const created = await YogaClass.insertMany(CLASSES);
    console.log(`Inserted ${created.length} classes`);
    process.exit(0);
  } catch (err) {
    console.error('Seed error', err);
    process.exit(1);
  }
}

seed();
