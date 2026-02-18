import { Router } from 'express';
import {
  register,
  login,
  refreshToken,
  logout,
  getProfile,
  updateProfile,
  changePassword,
  getAllUsers,
} from '@/controllers';
import { authenticate, authorize } from '@/middleware';
import { validateRequest } from '@/middleware';
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
} from '@/validators';
import { authRateLimit, apiRateLimit } from '@/middleware';

const router = Router();

// Apply rate limiting to all routes
router.use(apiRateLimit);

// POST /api/auth/register - Register new user
router.post(
  '/register',
  authRateLimit,
  validateRequest(registerSchema),
  register
);

// POST /api/auth/login - Login user
router.post(
  '/login',
  authRateLimit,
  validateRequest(loginSchema),
  login
);

// POST /api/auth/refresh - Refresh access token
router.post('/refresh', refreshToken);

// POST /api/auth/logout - Logout user
router.post('/logout', logout);

// GET /api/auth/profile - Get user profile
router.get('/profile', authenticate, getProfile);

// PUT /api/auth/profile - Update user profile
router.put(
  '/profile',
  authenticate,
  validateRequest(updateProfileSchema),
  updateProfile
);

// PUT /api/auth/change-password - Change password
router.put(
  '/change-password',
  authenticate,
  validateRequest(changePasswordSchema),
  changePassword
);

// GET /api/auth/users - Get all users (admin only)
router.get('/users', authenticate, authorize('admin'), getAllUsers);

export default router;
