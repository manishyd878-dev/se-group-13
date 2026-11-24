import mongoose from 'mongoose';

/**
 * Connects to MongoDB Atlas using the connection string supplied via
 * the MONGO_URI environment variable (loaded from .env).
 *
 * This function never reads or hardcodes credentials itself — it only
 * consumes whatever the environment provides.
 */
export default async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error(
      '\n[bloodbridge] MONGO_URI is not set. Create a .env file (see .env.example) ' +
        'with your MongoDB Atlas connection string as MONGO_URI.\n'
    );
    process.exit(1);
  }

  mongoose.set('strictQuery', true);

  try {
    const conn = await mongoose.connect(uri, {
      // Modern mongoose drivers no longer need useNewUrlParser/useUnifiedTopology,
      // they're kept out intentionally to avoid deprecation warnings.
    });

    console.log(`[bloodbridge] MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);

    mongoose.connection.on('error', (err) => {
      console.error('[bloodbridge] MongoDB connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[bloodbridge] MongoDB disconnected');
    });

    return conn;
  } catch (err) {
    console.error('[bloodbridge] Failed to connect to MongoDB:', err.message);
    process.exit(1);
  }
}
