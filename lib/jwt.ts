import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export function signJwtToken(payload: any) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
}

export function verifyJwtToken(token: string) {
  try {
      return jwt.verify(token, JWT_SECRET) as { email: string };
  } catch (error) {
      console.error('Error verifying JWT token:', error);
      return null;
  }
}