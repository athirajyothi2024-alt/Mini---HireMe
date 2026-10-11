const { application } = require('express');
const Application = require('../models/applications');
const Job = require('../models/job');
const applications = require('../models/applications');
const applyJob = async (req, res) => {
  try {
    console.log('req.user:', req.user);
    console.log('jobId:', req.params.jobId);
    console.log('body:', req.body);
    const coverNote = req.body?.coverNote || '';
    const { jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        message: 'Job not found',
      });
    }
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.user.id,
    });
    if (existingApplication) {
      return res.status(400).json({
        message: 'you have already applied for this job',
      });
    }

    const application = new Application({
      job: jobId,
      applicant: req.user.id,
      coverNote,
    });
    await application.save();
    res.status(201).json({
      message: 'Application submitted successfully',
      application,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      applicant: req.user.id,
    })
      .populate('job', 'title company location')
      .populate('applicant', 'name email');

    res.status(200).json({
      count: applications.length,
      applications,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getApplicantsByJob = async (req, res) => {
  try {
    const applications = await Application.find({
      job: req.params.jobId,
    })
      .populate('applicant', '-password')
      .populate('job');
    res.status(200).json({
      count: applications.length,
      applications,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!application) {
      return res.status(404).json({
        message: 'Application not found',
      });
    }
    res.status(200).json({
      message: 'Status updated successfully',
      application,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = {
  applyJob,
  getMyApplications,
  getApplicantsByJob,
  updateApplicationStatus,
};
