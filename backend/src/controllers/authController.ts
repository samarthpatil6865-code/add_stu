import { Response } from 'express';
import { User, IUser } from '@/models/User';
import { ApiResponseHandler, asyncHandler } from '@/utils';
import { comparePassword, generateTokens, verifyToken } from '@/utils/authUtils';

export const register = asyncHandler(async (req: any, res: Response) => {
  const { username, email, password, firstName, lastName, role } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    if (existingUser.username === username) {
      return ApiResponseHandler.conflict(res, 'Username already exists');
    }
    if (existingUser.email === email) {
      return ApiResponseHandler.conflict(res, 'Email already exists');
    }
  }

  // Create new user
  const user = new User({
    username,
    email,
    password, // Will be hashed by pre-save hook
    firstName,
    lastName,
    role: role || 'staff',
  });

  await user.save();

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user._id.toString());

  // Save refresh token
  user.refreshTokens.push(refreshToken);
  await user.save();

  // Remove password from response
  const userResponse = user.toJSON();
  delete userResponse.password;

  return ApiResponseHandler.created(res, {
    user: userResponse,
    accessToken,
    refreshToken,
  }, 'User registered successfully');
});

export const login = asyncHandler(async (req: any, res: Response) => {
  const { username, password } = req.body;

  // Find user with password
  const user = await User.findOne({ username }).select('+password');

  if (!user) {
    return ApiResponseHandler.unauthorized(res, 'Invalid credentials');
  }

  if (!user.isActive) {
    return ApiResponseHandler.unauthorized(res, 'Account is deactivated');
  }

  // Check password
  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    return ApiResponseHandler.unauthorized(res, 'Invalid credentials');
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user._id.toString());

  // Save refresh token
  user.refreshTokens.push(refreshToken);
  await user.save();

  // Remove password from response
  const userResponse = user.toJSON();
  delete userResponse.password;

  return ApiResponseHandler.success(res, {
    user: userResponse,
    accessToken,
    refreshToken,
  }, 'Login successful');
});

export const refreshToken = asyncHandler(async (req: any, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return ApiResponseHandler.badRequest(res, 'Refresh token is required');
  }

  try {
    // Verify refresh token
    const decoded: any = verifyToken(refreshToken, true);
    
    // Find user
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      return ApiResponseHandler.unauthorized(res, 'Invalid refresh token');
    }

    // Check if refresh token exists in user's tokens
    if (!user.refreshTokens.includes(refreshToken)) {
      return ApiResponseHandler.unauthorized(res, 'Invalid refresh token');
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id.toString());

    // Remove old refresh token and add new one
    user.refreshTokens = user.refreshTokens.filter((token: string) => token !== refreshToken);
    user.refreshTokens.push(newRefreshToken);
    await user.save();

    return ApiResponseHandler.success(res, {
      accessToken,
      refreshToken: newRefreshToken,
    }, 'Token refreshed successfully');

  } catch (error) {
    return ApiResponseHandler.unauthorized(res, 'Invalid refresh token');
  }
});

export const logout = asyncHandler(async (req: any, res: Response) => {
  const { refreshToken } = req.body;
  const user = req.user;

  if (refreshToken && user) {
    // Remove refresh token from user's tokens
    user.refreshTokens = user.refreshTokens.filter((token: string) => token !== refreshToken);
    await user.save();
  }

  return ApiResponseHandler.success(res, null, 'Logout successful');
});

export const getProfile = asyncHandler(async (req: any, res: Response) => {
  const user = req.user;

  return ApiResponseHandler.success(res, user, 'Profile retrieved successfully');
});

export const updateProfile = asyncHandler(async (req: any, res: Response) => {
  const user = req.user;
  const { firstName, lastName, email } = req.body;

  // Check if email is being updated and already exists
  if (email && email !== user.email) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return ApiResponseHandler.conflict(res, 'Email already exists');
    }
  }

  // Update user
  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    { firstName, lastName, email },
    { new: true, runValidators: true }
  );

  return ApiResponseHandler.updated(res, updatedUser, 'Profile updated successfully');
});

export const changePassword = asyncHandler(async (req: any, res: Response) => {
  const user = req.user;
  const { currentPassword, newPassword } = req.body;

  // Get user with password
  const userWithPassword = await User.findById(user._id).select('+password');

  if (!userWithPassword) {
    return ApiResponseHandler.notFound(res, 'User not found');
  }

  // Check current password
  const isCurrentPasswordValid = await comparePassword(currentPassword, userWithPassword.password);

  if (!isCurrentPasswordValid) {
    return ApiResponseHandler.unauthorized(res, 'Current password is incorrect');
  }

  // Update password
  userWithPassword.password = newPassword;
  await userWithPassword.save();

  // Remove all refresh tokens (force re-login on all devices)
  userWithPassword.refreshTokens = [];
  await userWithPassword.save();

  return ApiResponseHandler.updated(res, null, 'Password changed successfully');
});

export const getAllUsers = asyncHandler(async (req: any, res: Response) => {
  const { page = 1, limit = 10, role, isActive = true } = req.query;

  const filter: any = { isActive };
  if (role) filter.role = role;

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const [users, total] = await Promise.all([
    User.find(filter)
      .select('-password -refreshTokens')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    User.countDocuments(filter),
  ]);

  const pagination = {
    page: pageNum,
    limit: limitNum,
    total,
    pages: Math.ceil(total / limitNum),
  };

  return ApiResponseHandler.success(res, users, 'Users retrieved successfully', 200, pagination);
});
