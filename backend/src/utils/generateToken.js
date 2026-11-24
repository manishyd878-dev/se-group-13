import jwt from 'jsonwebtoken';

export default function generateToken(userId) {
  const secret = process.env.JWT_SECRET || 'bloodbridge_super_secret_jwt_key_2026_dev';
  return jwt.sign({ id: userId }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}
