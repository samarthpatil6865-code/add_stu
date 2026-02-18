import { Router } from 'express';
import {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentsByClass,
  searchStudents,
  getClassStats,
} from '@/controllers';
import { authenticate, authorize } from '@/middleware';
import { validateRequest, validateQuery, validateParams } from '@/middleware';
import {
  createStudentSchema,
  updateStudentSchema,
  studentQuerySchema,
  studentParamsSchema,
} from '@/validators';
import { createRateLimit, apiRateLimit } from '@/middleware';

const router = Router();

// Apply rate limiting to all routes
router.use(apiRateLimit);

// GET /api/students/stats - Get class statistics
router.get('/stats', authenticate, getClassStats);

// GET /api/students/search - Search students
router.get('/search', authenticate, searchStudents);

// GET /api/students/class/:classId - Get students by class
router.get('/class/:classId', authenticate, getStudentsByClass);

// GET /api/students - Get all students with pagination and filtering
router.get(
  '/',
  authenticate,
  validateQuery(studentQuerySchema),
  getStudents
);

// GET /api/students/:id - Get student by ID
router.get(
  '/:id',
  authenticate,
  validateParams(studentParamsSchema),
  getStudentById
);

// POST /api/students - Create new student
router.post(
  '/',
  authenticate,
  authorize('admin', 'teacher', 'staff'),
  createRateLimit,
  validateRequest(createStudentSchema),
  createStudent
);

// PUT /api/students/:id - Update student
router.put(
  '/:id',
  authenticate,
  authorize('admin', 'teacher', 'staff'),
  validateParams(studentParamsSchema),
  validateRequest(updateStudentSchema),
  updateStudent
);

// DELETE /api/students/:id - Delete student
router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  validateParams(studentParamsSchema),
  deleteStudent
);

export default router;
