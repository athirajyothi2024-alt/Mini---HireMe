import JobCard from '../components/JobCard';
import Navbar from '../components/Navbar';
import './styles/StudentDashboard.css';
import axiosInstance from '../services/axiosInstance';
import { useEffect, useState } from 'react';

function StudentDashboard() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [jobType, setJobType] = useState('All');

  const filteredJobs = jobs.filter(job => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesJobType = jobType === 'All' || job.jobType === jobType;

    return matchesSearch && matchesJobType;
  });

  const fetchJobs = async () => {
    try {
      const response = await axiosInstance.get('/jobs');
      setJobs(response.data.jobs);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await axiosInstance.get('/applications/my');

      setApplications(response.data.applications);
    } catch (error) {
      console.log(error);
    }
  };

  const appliedJobIds = applications
    .filter(application => application.job)
    .map(application => application.job._id);

  useEffect(() => {
    fetchJobs();
    fetchApplications();
  }, []);

  return (
    <>
      <Navbar />

      <div className="student-dashboard">
        <div className="welcome-section">
          <h1>Welcome, {user?.name} 👋</h1>
          <p>Find your dream job today.</p>
        </div>

        <div className="search-section">
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />

          <select value={jobType} onChange={e => setJobType(e.target.value)}>
            <option value="All">All Jobs</option>
            <option value="Full Time">Full Time</option>
            <option value="Part Time">Part Time</option>
            <option value="Internship">Internship</option>
          </select>
        </div>

        <div className="jobs-container">
          {filteredJobs.length > 0 ? (
            filteredJobs.map(job => (
              <JobCard
                key={job._id}
                job={job}
                isApplied={appliedJobIds.includes(job._id)}
              />
            ))
          ) : (
            <h3>No Jobs available</h3>
          )}
        </div>
      </div>
    </>
  );
}

export default StudentDashboard;
