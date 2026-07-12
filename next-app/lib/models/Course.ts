import { Schema, models, model } from 'mongoose';

const CourseSchema = new Schema({
  slug: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], required: true },
  category: { type: String, required: true },
  duration: { type: String, required: true },
  icon: { type: String, default: 'BookOpen' },
  c1: { type: String, default: '#3b82f6' },
  c2: { type: String, default: '#1d4ed8' },
  lessons: [{ id: String, title: String, duration: String, content: String }],
});

export const Course = models.Course || model('Course', CourseSchema);
