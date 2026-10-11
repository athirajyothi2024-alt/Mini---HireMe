import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../services/axiosInstance';
import Navbar from '../components/Navbar';
import './styles/CreateJob.css';

function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    experience: '',
    jobType: '',
    description: '',
    skills: '',
  });

  useEffect(() => {
    fetchJob();
  }, []);

  const fetchJob = async () => {
    try {
      const response = await axiosInstance.get(`/jobs/${id}`);

      const job = response.data;

      setFormData({
        title: job.title,
        company: job.company,
        location: job.location,
        salary: job.salary,
        experience: job.experience,
        jobType: job.jobType,
        description: job.description,
        skills: job.skills.join(', '),
      });
    } catch (error) {
      toast.error('Failed to load job');
    }
  };

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

      await axiosInstance.put(`/jobs/${id}`, payload);

      toast.success('Job updated successfully!');

      navigate('/recruiterDashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update job');
    }
  };

  return (
    <>
      <Navbar />

      <div className="create-job-container">
        <h1>Edit Job</h1>

        <form className="job-form" onSubmit={handleSubmit}>
          <input
            name="title"
            placeholder="Job Title"
            value={formData.title}
            onChange={handleChange}
          />

          <input
            name="company"
            placeholder="Company"
            value={formData.company}
            onChange={handleChange}
          />

          <input
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
          />

          <input
            name="salary"
            placeholder="Salary"
            value={formData.salary}
            onChange={handleChange}
          />

          <input
            name="experience"
            placeholder="Experience"
            value={formData.experience}
            onChange={handleChange}
          />

          <select
            name="jobType"
            value={formData.jobType}
            onChange={handleChange}
          >
            <option value="">Select Job Type</option>
            <option value="Full Time">Full Time</option>
            <option value="Part Time">Part Time</option>
            <option value="Internship">Internship</option>
          </select>

          <textarea
            name="description"
            placeholder="Job Description"
            value={formData.description}
            onChange={handleChange}
          />

          <input
            name="skills"
            placeholder="React, Node.js, MongoDB"
            value={formData.skills}
            onChange={handleChange}
          />

          <button type="submit">Update Job</button>
        </form>
      </div>
    </>
  );
}

export default EditJob;
