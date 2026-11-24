// Optional helper: populates the database with sample hospitals so the
// frontend has data to render immediately. Run with: npm run seed
// Reads MONGO_URI from your own .env — never hardcode credentials here.
import dotenv from 'dotenv';
dotenv.config();

import connectDB from '../config/db.js';
import Hospital from '../models/Hospital.js';
import mongoose from 'mongoose';

const sampleHospitals = [
  {
    name: 'Sanjeevani General Hospital',
    address: 'MI Road, Jaipur',
    city: 'Jaipur',
    phone: '+91 141 2200 111',
    rating: 4.8,
    verified: true,
    location: { type: 'Point', coordinates: [75.7873, 26.9124] },
    stock: { 'A+': 12, 'A-': 2, 'B+': 20, 'B-': 0, 'AB+': 5, 'AB-': 1, 'O+': 30, 'O-': 4 },
  },
  {
    name: 'Rajdhani Blood Bank & Trust',
    address: 'C-Scheme, Jaipur',
    city: 'Jaipur',
    phone: '+91 141 2200 222',
    rating: 4.6,
    verified: true,
    location: { type: 'Point', coordinates: [75.7927, 26.9139] },
    stock: { 'A+': 4, 'A-': 0, 'B+': 8, 'B-': 3, 'AB+': 0, 'AB-': 0, 'O+': 14, 'O-': 6 },
  },
  {
    name: 'Lifeline Care Hospital',
    address: 'Malviya Nagar, Jaipur',
    city: 'Jaipur',
    phone: '+91 141 2200 333',
    rating: 4.4,
    verified: true,
    location: { type: 'Point', coordinates: [75.8155, 26.8535] },
    stock: { 'A+': 0, 'A-': 1, 'B+': 2, 'B-': 0, 'AB+': 3, 'AB-': 0, 'O+': 6, 'O-': 0 },
  },
  {
    name: 'Apex Multispeciality',
    address: 'Vaishali Nagar, Jaipur',
    city: 'Jaipur',
    phone: '+91 141 2200 444',
    rating: 4.7,
    verified: true,
    location: { type: 'Point', coordinates: [75.7357, 26.9127] },
    stock: { 'A+': 18, 'A-': 5, 'B+': 11, 'B-': 4, 'AB+': 7, 'AB-': 2, 'O+': 22, 'O-': 9 },
  },
];

async function seed() {
  await connectDB();
  await Hospital.deleteMany({});
  await Hospital.insertMany(sampleHospitals);
  console.log(`[bloodbridge] Seeded ${sampleHospitals.length} hospitals`);
  await mongoose.connection.close();
  process.exit(0);
}

seed().catch((err) => {
  console.error('[bloodbridge] Seed failed:', err);
  process.exit(1);
});
