import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '@/config';

export const hashPassword = async (password: string): Promise<string> => {
  try {
    const salt = await bcrypt.genSalt(config.BCRYPT_ROUNDS);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw new Error('Error hashing password');
  }
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    throw new Error('Error comparing passwords');
  }
};

export const generateTokens = (userId: string) => {
  const accessToken = jwt.sign(
    { id: userId },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRE }
  );

  const refreshToken = jwt.sign(
    { id: userId },
    config.JWT_REFRESH_SECRET,
    { expiresIn: config.JWT_REFRESH_EXPIRE }
  );

  return { accessToken, refreshToken };
};

export const verifyToken = (token: string, isRefreshToken: boolean = false) => {
  const secret = isRefreshToken ? config.JWT_REFRESH_SECRET : config.JWT_SECRET;
  return jwt.verify(token, secret);
};

export const generateRandomString = (length: number = 32): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};
