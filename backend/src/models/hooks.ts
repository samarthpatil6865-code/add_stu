import bcrypt from 'bcryptjs';
import { User } from '@/models/User';

// Pre-save hook to hash password
User.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Pre-save hook to validate currentStrength doesn't exceed capacity
User.pre('save', async function(next) {
  // This would be relevant if we had class capacity validation
  next();
});

export {};
