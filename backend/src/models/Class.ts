import mongoose, { Document, Schema } from 'mongoose';

export interface IClass extends Document {
  name: string;
  displayName: string;
  description?: string;
  teacher?: string;
  roomNumber?: string;
  capacity: number;
  currentStrength: number;
  isActive: boolean;
  academicYear: string;
  createdAt: Date;
  updatedAt: Date;
}

const classSchema = new Schema<IClass>({
  name: {
    type: String,
    required: [true, 'Class name is required'],
    trim: true,
    unique: true,
    maxlength: [50, 'Class name cannot exceed 50 characters'],
  },
  displayName: {
    type: String,
    required: [true, 'Display name is required'],
    trim: true,
    maxlength: [100, 'Display name cannot exceed 100 characters'],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters'],
  },
  teacher: {
    type: String,
    trim: true,
    maxlength: [100, 'Teacher name cannot exceed 100 characters'],
  },
  roomNumber: {
    type: String,
    trim: true,
    maxlength: [20, 'Room number cannot exceed 20 characters'],
  },
  capacity: {
    type: Number,
    required: [true, 'Capacity is required'],
    min: [1, 'Capacity must be at least 1'],
    max: [100, 'Capacity cannot exceed 100'],
  },
  currentStrength: {
    type: Number,
    default: 0,
    min: [0, 'Current strength cannot be negative'],
    validate: {
      validator: function(value: number) {
        return value <= this.capacity;
      },
      message: 'Current strength cannot exceed capacity',
    },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  academicYear: {
    type: String,
    required: [true, 'Academic year is required'],
    validate: {
      validator: function(value: string) {
        return /^\d{4}-\d{4}$/.test(value);
      },
      message: 'Academic year must be in format YYYY-YYYY',
    },
  },
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc: any, ret: any) {
      delete ret.__v;
      return ret;
    },
  },
});

// Indexes for better performance
classSchema.index({ name: 1 });
classSchema.index({ isActive: 1 });
classSchema.index({ academicYear: 1 });

export const Class = mongoose.model<IClass>('Class', classSchema);
