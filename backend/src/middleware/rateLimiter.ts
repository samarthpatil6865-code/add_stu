import { Request, Response, NextFunction } from 'express';
import { RateLimiterMemory } from 'rate-limiter-flexible';

// Create rate limiters for different endpoints
const apiLimiter = new RateLimiterMemory({
  keyGenerator: (req: Request) => req.ip || 'unknown',
  points: 100, // Number of requests
  duration: 900, // Per 15 minutes (900 seconds)
});

const authLimiter = new RateLimiterMemory({
  keyGenerator: (req: Request) => req.ip || 'unknown',
  points: 5, // Number of login attempts
  duration: 900, // Per 15 minutes
});

const createLimiter = new RateLimiterMemory({
  keyGenerator: (req: Request) => req.ip || 'unknown',
  points: 10, // Number of create operations
  duration: 3600, // Per hour
});

export const rateLimitMiddleware = (limiter: RateLimiterMemory) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await limiter.consume(req.ip || 'unknown');
      next();
    } catch (rejRes: any) {
      const secs = Math.round(rejRes.msBeforeNext / 1000) || 1;
      res.set('Retry-After', String(secs));
      res.status(429).json({
        success: false,
        message: 'Too many requests',
        retryAfter: secs,
      });
    }
  };
};

export const apiRateLimit = rateLimitMiddleware(apiLimiter);
export const authRateLimit = rateLimitMiddleware(authLimiter);
export const createRateLimit = rateLimitMiddleware(createLimiter);
