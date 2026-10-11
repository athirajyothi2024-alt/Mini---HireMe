import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import axiosInstance from '../services/axiosInstance';
import './styles/CreateJob.css';

function CreateJob() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    experience: '',
    jobType: 'Full Time',
    description: '',
    skills: '',
  });

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        skills: formData.skills.split(',').map(skill => skill.trim()),
      };

      await axiosInstance.post('/jobs', payload);

      toast.success('Job created successfully!');

      navigate('/recruiterDashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create job');
    }
  };

  return (
    <>
      <Navbar />

      <div className="create-job-container">
        <h1>Create Job</h1>

        <form className="job-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Job Title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="company"
            placeholder="Company"
            value={formData.company}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="salary"
            placeholder="Salary"
            value={formData.salary}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="experience"
            placeholder="Experience"
            value={formData.experience}
            onChange={handleChange}
            required
          />

          <select
            name="jobType"
            value={formData.jobType}
            onChange={handleChange}
          >
            <option>Full Time</option>
            <option>Part Time</option>
            <option>Internship</option>
          </select>

          <textarea
            name="description"
            placeholder="Job Description"
            rows="5"
            value={formData.description}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="skills"
            placeholder="React, Node.js, MongoDB"
            value={formData.skills}
            onChange={handleChange}
            required
          />

          <button type="submit">Post Job</button>
        </form>
      </div>
    </>
  );
}

export default CreateJob;
