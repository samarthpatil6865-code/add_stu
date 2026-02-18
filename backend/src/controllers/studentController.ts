import { Response } from 'express';
import { Student, IStudent } from '@/models/Student';
import { ApiResponseHandler, asyncHandler } from '@/utils';

export const getStudents = asyncHandler(async (req: any, res: Response) => {
  const {
    page = 1,
    limit = 10,
    class: className,
    section,
    gender,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    isActive = true,
  } = req.query;

  // Build filter
  const filter: any = { isActive };
  
  if (className) filter.class = className;
  if (section) filter.section = section;
  if (gender) filter.gender = gender;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { rollNo: { $regex: search, $options: 'i' } },
    ];
  }

  // Build sort
  const sort: any = {};
  sort[sortBy as string] = sortOrder === 'asc' ? 1 : -1;

  // Calculate pagination
  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const skip = (pageNum - 1) * limitNum;

  // Execute query
  const [students, total] = await Promise.all([
    Student.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Student.countDocuments(filter),
  ]);

  const pagination = {
    page: pageNum,
    limit: limitNum,
    total,
    pages: Math.ceil(total / limitNum),
  };

  return ApiResponseHandler.success(res, students, 'Students retrieved successfully', 200, pagination);
});

export const getStudentById = asyncHandler(async (req: any, res: Response) => {
  const { id } = req.params;

  const student = await Student.findById(id);

  if (!student) {
    return ApiResponseHandler.notFound(res, 'Student not found');
  }

  return ApiResponseHandler.success(res, student, 'Student retrieved successfully');
});

export const createStudent = asyncHandler(async (req: any, res: Response) => {
  const studentData = req.body;

  // Check if roll number already exists
  const existingStudent = await Student.findOne({ rollNo: studentData.rollNo });
  if (existingStudent) {
    return ApiResponseHandler.conflict(res, 'Roll number already exists');
  }

  const student = new Student(studentData);
  await student.save();

  return ApiResponseHandler.created(res, student, 'Student created successfully');
});

export const updateStudent = asyncHandler(async (req: any, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  // Check if roll number already exists (if being updated)
  if (updateData.rollNo) {
    const existingStudent = await Student.findOne({ 
      rollNo: updateData.rollNo, 
      _id: { $ne: id } 
    });
    if (existingStudent) {
      return ApiResponseHandler.conflict(res, 'Roll number already exists');
    }
  }

  const student = await Student.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  );

  if (!student) {
    return ApiResponseHandler.notFound(res, 'Student not found');
  }

  return ApiResponseHandler.updated(res, student, 'Student updated successfully');
});

export const deleteStudent = asyncHandler(async (req: any, res: Response) => {
  const { id } = req.params;

  const student = await Student.findByIdAndDelete(id);

  if (!student) {
    return ApiResponseHandler.notFound(res, 'Student not found');
  }

  return ApiResponseHandler.deleted(res, 'Student deleted successfully');
});

export const getStudentsByClass = asyncHandler(async (req: any, res: Response) => {
  const { classId } = req.params;

  let students;
  if (classId === '6-10') {
    students = await Student.find({
      class: { $gte: '6', $lte: '10' },
      isActive: true,
    }).sort({ rollNo: 1 });
  } else {
    students = await Student.find({
      class: classId,
      isActive: true,
    }).sort({ rollNo: 1 });
  }

  return ApiResponseHandler.success(res, students, 'Students retrieved successfully');
});

export const searchStudents = asyncHandler(async (req: any, res: Response) => {
  const { q } = req.query;

  if (!q || typeof q !== 'string') {
    return ApiResponseHandler.badRequest(res, 'Search query is required');
  }

  const students = await Student.find({
    isActive: true,
    $or: [
      { name: { $regex: q, $options: 'i' } },
      { rollNo: { $regex: q, $options: 'i' } },
    ],
  }).limit(50);

  return ApiResponseHandler.success(res, students, 'Search results retrieved successfully');
});

export const getClassStats = asyncHandler(async (req: any, res: Response) => {
  const stats = await Student.aggregate([
    {
      $match: { isActive: true },
    },
    {
      $group: {
        _id: '$class',
        count: { $sum: 1 },
        maleCount: {
          $sum: { $cond: [{ $eq: ['$gender', 'Male'] }, 1, 0] },
        },
        femaleCount: {
          $sum: { $cond: [{ $eq: ['$gender', 'Female'] }, 1, 0] },
        },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  return ApiResponseHandler.success(res, stats, 'Class statistics retrieved successfully');
});
