const mongoose = require('mongoose');
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['Student', 'Recruiter'],
    },
    profileImage: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: '',
    },
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    skills: {
      type: [String],
      default: [],
    },
    resume: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model('User', userSchema);
