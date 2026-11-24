import dotenv from 'dotenv';
dotenv.config();

import connectDB from './src/config/db.js';
import app from './src/app.js';

const PORT = process.env.PORT || 5000;

async function start() {
  await connectDB();

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`[bloodbridge] API server listening on port ${PORT}`);
  });

  // Graceful shutdown
  const shutdown = (signal) => {
    console.log(`\n[bloodbridge] Received ${signal}, shutting down gracefully...`);
    server.close(() => process.exit(0));
  };
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));

  process.on('unhandledRejection', (err) => {
    console.error('[bloodbridge] Unhandled rejection:', err);
    server.close(() => process.exit(1));
  });
}

start();
