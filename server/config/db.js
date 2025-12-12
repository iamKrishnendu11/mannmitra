// config/db.js
import mongoose from 'mongoose';

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI environment variable not set');
  }

  mongoose.set('strictQuery', false);

  try {
    await mongoose.connect(uri, {
      // options
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // bufferTimeoutMS controls how long operations will buffer (default 10000)
      bufferTimeoutMS: 20000 // optional: make it a bit longer while debugging
    });

    mongoose.connection.on('connected', () => console.log('MongoDB connected'));
    mongoose.connection.on('error', (err) => console.error('MongoDB connection error:', err));
    mongoose.connection.on('disconnected', () => console.warn('MongoDB disconnected'));

    console.log('Mongoose connection established');
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    // throw so server startup fails and you see the error immediately
    throw err;
  }
};

export default connectDB;
