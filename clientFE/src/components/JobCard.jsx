import './JobCard.css';
import React from 'react';
import axiosInstance from '../services/axiosInstance';
import { toast } from 'react-toastify';

function JobCard({ job, isApplied }) {
  const applyJob = async () => {
    try {
      await axiosInstance.post(`/applications/apply/${job._id}`);
      toast.success('Application submitted successfully');
    } catch (error) {
      error?.response?.data?.message || 'Failed to apply';
    }
  };

  return (
    <div className="job-card">
      <h2>{job.title}</h2>
      <h4>{job.company}</h4>

      <div className="job-info">
        <span>{job.location}</span>
        <span>{job.salary}</span>
        <span>{job.experience}</span>
        <span>{job.jobType}</span>
      </div>

      <p className="description">{job.description}</p>

      <div className="skills">
        {job.skills.map((skill, index) => (
          <span key={index} className="skill">
            {skill}
          </span>
        ))}
      </div>

      {isApplied ? (
        <button className="applied-btn" disabled>
          ✓ Applied
        </button>
      ) : (
        <button className="apply-btn" onClick={applyJob}>
          Apply Now
        </button>
      )}
    </div>
  );
}

export default JobCard;
