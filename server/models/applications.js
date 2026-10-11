const mongoose = require('mongoose');
const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: 'true',
    },
    coverNote: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Applied', 'Reviewed', 'Shortlisted'],
      default: 'Applied',
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model('Application', applicationSchema);
