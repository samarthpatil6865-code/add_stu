import mongoose, { Document, Schema } from 'mongoose';

export interface IStudent extends Document {
  name: string;
  rollNo: string;
  class: string;
  section: string;
  gender: 'Male' | 'Female' | 'Other';
  address: string;
  photo?: string;
  dateOfBirth?: Date;
  parentName?: string;
  contactNumber?: string;
  email?: string;
  admissionDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const studentSchema = new Schema<IStudent>({
  name: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  rollNo: {
    type: String,
    required: [true, 'Roll number is required'],
    trim: true,
    unique: true,
    maxlength: [20, 'Roll number cannot exceed 20 characters'],
  },
  class: {
    type: String,
    required: [true, 'Class is required'],
    trim: true,
    validate: {
      validator: function(value: string) {
        return /^([1-9]|10)$/.test(value);
      },
      message: 'Class must be between 1 and 10',
    },
  },
  section: {
    type: String,
    required: [true, 'Section is required'],
    enum: {
      values: ['A', 'B'],
      message: 'Section must be either A or B',
    },
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: {
      values: ['Male', 'Female', 'Other'],
      message: 'Gender must be Male, Female, or Other',
    },
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true,
    maxlength: [500, 'Address cannot exceed 500 characters'],
  },
  photo: {
    type: String,
    default: null,
  },
  dateOfBirth: {
    type: Date,
    validate: {
      validator: function(value: Date) {
        return !value || value < new Date();
      },
      message: 'Date of birth cannot be in the future',
    },
  },
  parentName: {
    type: String,
    trim: true,
    maxlength: [100, 'Parent name cannot exceed 100 characters'],
  },
  contactNumber: {
    type: String,
    validate: {
      validator: function(value: string) {
        return !value || /^[0-9]{10}$/.test(value);
      },
      message: 'Contact number must be a valid 10-digit number',
    },
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(value: string) {
        return !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      },
      message: 'Email must be a valid email address',
    },
  },
  admissionDate: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    },
  },
});

// Indexes for better performance
studentSchema.index({ rollNo: 1 });
studentSchema.index({ class: 1, section: 1 });
studentSchema.index({ name: 'text' });
studentSchema.index({ isActive: 1 });

export const Student = mongoose.model<IStudent>('Student', studentSchema);
