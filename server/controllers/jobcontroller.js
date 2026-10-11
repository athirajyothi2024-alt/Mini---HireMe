const job = require('../models/job');
const Job = require('../models/job');
const createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      salary,
      experience,
      jobType,
      description,
      skills,
    } = req.body;

    const job = new Job({
      title,
      company,
      location,
      salary,
      experience,
      jobType,
      description,
      skills,
      recruiter: req.user.id,
    });
    await job.save();
    res.status(201).json({
      message: 'Job created successfully',
      job,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate('recruiter', 'name email');
    res.status(200).json({
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    res.statsu(500).json({
      message: error.message,
    });
  }
};

const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      'recruiter',
      'name email'
    );
    if (!job) {
      return res.status(404).json({
        message: 'Job not found',
      });
    }
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const updateJob = async (req, res) => {
  try {
    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedJob) {
      return res.status(401).json({
        message: 'Job not found',
      });
    }
    res.status(200).json({
      message: 'Job updated successfully',
      job: updatedJob,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const deleteJob = async (req, res) => {
  try {
    const deletedJob = await Job.findByIdAndDelete(req.params.id);
    if (!deletedJob) {
      return res.status(401).json({
        message: 'Job not found',
      });
    }
    res.status(200).json({
      message: 'Job Deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
};
