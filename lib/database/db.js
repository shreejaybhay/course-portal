import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const connectToDatabase = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  try {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: 'users-datas', // Replace with your database name
      bufferCommands: false,
      connectTimeoutMS: 30000
    });

    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Unable to connect to MongoDB');
  }
}