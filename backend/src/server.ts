import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import { config } from '@/config';
import { database } from '@/config/database';
import { ApiResponseHandler } from '@/utils';
import studentRoutes from '@/routes';
import authRoutes from '@/routes/authRoutes';

const app = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
app.use(cors({
  origin: config.ALLOWED_ORIGINS,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
if (config.isDevelopment) {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const dbHealth = await database.healthCheck();
    return ApiResponseHandler.success(res, {
      status: 'healthy',
      timestamp: new Date(),
      database: dbHealth,
      environment: config.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0',
    }, 'Server is healthy');
  } catch (error) {
    return ApiResponseHandler.error(res, 'Server is unhealthy', 503);
  }
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);

// 404 handler
app.use('*', (req, res) => {
  return ApiResponseHandler.notFound(res, 'Route not found');
});

// Global error handler
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error handler:', error);

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map((err: any) => ({
      field: err.path,
      message: err.message,
    }));
    return ApiResponseHandler.badRequest(res, 'Validation error', errors);
  }

  // Mongoose duplicate key error
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0];
    return ApiResponseHandler.conflict(res, `${field} already exists`);
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    return ApiResponseHandler.unauthorized(res, 'Invalid token');
  }

  if (error.name === 'TokenExpiredError') {
    return ApiResponseHandler.unauthorized(res, 'Token expired');
  }

  // Default error
  return ApiResponseHandler.error(
    res,
    config.isDevelopment ? error.message : 'Internal server error',
    500,
    config.isDevelopment ? error.stack : undefined
  );
});

const PORT = config.PORT;

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await database.connect();
    
    // Start listening
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📚 Environment: ${config.NODE_ENV}`);
      console.log(`🌐 CORS origins: ${config.ALLOWED_ORIGINS.join(', ')}`);
      console.log(`📍 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  await database.disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully...');
  await database.disconnect();
  process.exit(0);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

startServer();

export default app;
