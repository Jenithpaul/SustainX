import jwt, { Secret } from 'jsonwebtoken';

const generateToken = (id: string): string => {
  const secretKey: Secret = process.env.JWT_SECRET || "default_secret_key"; // Ensure a fallback value
  return jwt.sign({ id }, secretKey, {
    expiresIn: process.env.JWT_EXPIRES_IN ? parseInt(process.env.JWT_EXPIRES_IN, 10) : '7d', // Ensure the expiration is correctly typed
  });
};

export default generateToken;