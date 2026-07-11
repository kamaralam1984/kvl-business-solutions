import { Schema, models, model } from 'mongoose';

const JobSchema = new Schema({
  slug: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  department: { type: String, default: 'Engineering' },
  location: { type: String, default: 'Patna, India' },
  type: { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Internship'], default: 'Full-time' },
  remote: { type: Boolean, default: false },
  experience: String, // "2-5 years"
  salary: String,     // "₹6-12 LPA" or "Negotiable"
  description: String, // markdown
  requirements: { type: [String], default: [] },
  responsibilities: { type: [String], default: [] },
  active: { type: Boolean, default: true, index: true },
  applicationCount: { type: Number, default: 0 },
}, { timestamps: true });

JobSchema.index({ active: 1, createdAt: -1 });

export const Job = models.Job || model('Job', JobSchema);

const ApplicationSchema = new Schema({
  job: { type: Schema.Types.ObjectId, ref: 'Job', index: true },
  jobTitle: String,
  name: { type: String, required: true },
  email: { type: String, required: true, index: true },
  phone: { type: String, required: true },
  experience: String,
  currentRole: String,
  linkedinUrl: String,
  resumeUrl: String,
  resumePublicId: String,
  coverLetter: String,
  status: { type: String, enum: ['new', 'reviewed', 'shortlisted', 'interview', 'offered', 'rejected'], default: 'new', index: true },
}, { timestamps: true });

ApplicationSchema.index({ job: 1, createdAt: -1 });

export const Application = models.Application || model('Application', ApplicationSchema);
