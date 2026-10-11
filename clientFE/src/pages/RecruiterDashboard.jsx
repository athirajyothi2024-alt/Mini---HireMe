import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  PlusOutlined,
  EnvironmentOutlined,
  BankOutlined,
  TeamOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
} from '@ant-design/icons';

import axiosInstance from '../services/axiosInstance';
import Navbar from '../components/Navbar';
import './styles/RecruiterDashboard.css';

function RecruiterDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const navigate = useNavigate();

  const fetchJobs = async () => {
    setLoading(true);
    setLoadError(false);

    try {
      const response = await axiosInstance.get('/jobs');
      const jobsData = response.data?.jobs;
      setJobs(Array.isArray(jobsData) ? jobsData : []);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      setLoadError(true);
      toast.error('Failed to load jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async id => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this job?'
    );

    if (!confirmDelete) return;

    setDeletingId(id);

    try {
      await axiosInstance.delete(`/jobs/${id}`);
      toast.success('Job deleted successfully');
      await fetchJobs();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete job');
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <>
      <Navbar />

      <main className="recruiter-dashboard">
        <section className="recruiter-welcome">
          <div className="recruiter-welcome-content">
            <span className="recruiter-eyebrow">RECRUITER WORKSPACE</span>
            <h1>Welcome, {user.name || 'Recruiter'} 👋</h1>
            <p>
              Manage your job postings, review applicants, and find the right
              talent for your team.
            </p>

            <button
              type="button"
              className="create-job-btn"
              onClick={() => navigate('/createJob')}
            >
              <PlusOutlined />
              Create Job
            </button>
          </div>

          <div className="recruiter-welcome-illustration" aria-hidden="true">
            <div className="recruiter-illustration-circle">
              <TeamOutlined />
            </div>
          </div>
        </section>

        <section className="recruiter-jobs-section">
          <div className="recruiter-section-heading">
            <div>
              <h2>My Posted Jobs</h2>
              <p>Keep track of the opportunities you've shared.</p>
            </div>

            {!loading && !loadError && (
              <span className="recruiter-job-count">
                {jobs.length} {jobs.length === 1 ? 'Job' : 'Jobs'}
              </span>
            )}
          </div>

          {loading ? (
            <div className="recruiter-state-card">
              <div className="recruiter-spinner" />
              <h3>Loading your jobs</h3>
              <p>Please wait while we fetch your job postings.</p>
            </div>
          ) : loadError ? (
            <div className="recruiter-state-card">
              <div className="recruiter-state-icon">
                <ReloadOutlined />
              </div>
              <h3>Couldn't load your jobs</h3>
              <p>Check your connection and try again.</p>
              <button
                type="button"
                className="recruiter-retry-btn"
                onClick={fetchJobs}
              >
                <ReloadOutlined />
                Try Again
              </button>
            </div>
          ) : jobs.length === 0 ? (
            <div className="recruiter-state-card">
              <div className="recruiter-state-icon">
                <BankOutlined />
              </div>
              <h3>No jobs posted yet</h3>
              <p>
                Create your first job posting to start receiving applications.
              </p>
              <button
                type="button"
                className="create-job-btn"
                onClick={() => navigate('/createJob')}
              >
                <PlusOutlined />
                Create Your First Job
              </button>
            </div>
          ) : (
            <div className="recruiter-jobs-grid">
              {jobs.map(job => (
                <article className="recruiter-job-card" key={job._id}>
                  <div className="recruiter-job-card-top">
                    <div className="recruiter-job-icon">
                      <BankOutlined />
                    </div>
                    <span className="recruiter-job-badge">Posted Job</span>
                  </div>

                  <div className="recruiter-job-info">
                    <h3>{job.title || 'Untitled position'}</h3>

                    <div className="recruiter-job-meta">
                      <div>
                        <BankOutlined />
                        <span>{job.company || 'Company not specified'}</span>
                      </div>

                      <div>
                        <EnvironmentOutlined />
                        <span>{job.location || 'Location not specified'}</span>
                      </div>
                    </div>

                    {job.description && (
                      <p className="recruiter-job-description">
                        {job.description}
                      </p>
                    )}
                  </div>

                  <div className="recruiter-job-actions">
                    <button
                      type="button"
                      className="view-btn"
                      onClick={() => navigate(`/applicants/${job._id}`)}
                    >
                      <TeamOutlined />
                      View Applicants
                    </button>

                    <div className="recruiter-secondary-actions">
                      <button
                        type="button"
                        className="edit-btn"
                        onClick={() => navigate(`/editJob/${job._id}`)}
                      >
                        <EditOutlined />
                        Edit
                      </button>

                      <button
                        type="button"
                        className="delete-btn"
                        disabled={deletingId === job._id}
                        onClick={() => deleteJob(job._id)}
                      >
                        <DeleteOutlined />
                        {deletingId === job._id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}

export default RecruiterDashboard;
