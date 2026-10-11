import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import axiosInstance from '../services/axiosInstance';
import './styles/MyApplications.css';

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await axiosInstance.get('/applications/my');

        // Handle unexpected API response safely
        const data = response.data?.applications;
        setApplications(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching applications:', err);
        setError(
          err.response?.data?.message ||
            'Unable to load your applications. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  return (
    <>
      <Navbar />

      <main className="applications-page">
        <div className="applications-header">
          <div>
            <h1>My Applications</h1>
            <p>Track your job applications and their progress.</p>
          </div>

          {!loading && !error && (
            <span className="applications-count">
              {applications.length}{' '}
              {applications.length === 1 ? 'Application' : 'Applications'}
            </span>
          )}
        </div>

        {loading ? (
          <div className="applications-message">
            <div className="applications-spinner" />
            <p>Loading your applications...</p>
          </div>
        ) : error ? (
          <div className="applications-message applications-error">
            <h3>Something went wrong</h3>
            <p>{error}</p>
            <button
              className="applications-retry-btn"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        ) : applications.length === 0 ? (
          <div className="applications-empty">
            <div className="applications-empty-icon">📄</div>
            <h2>No applications yet</h2>
            <p>
              You haven't applied for any jobs yet. Explore available jobs and
              take the next step in your career.
            </p>
          </div>
        ) : (
          <div className="applications-list">
            {applications.map(application => {
              const job = application.job;
              const status = application.status || 'Applied';

              const appliedDate =
                application.appliedAt || application.createdAt;

              return (
                <article className="application-card" key={application._id}>
                  <div className="application-card-top">
                    <div className="application-job-info">
                      <h2>{job?.title || 'Job no longer available'}</h2>
                      <h4>{job?.company || 'Company not available'}</h4>
                    </div>

                    <span
                      className={`application-status status-${status
                        .toLowerCase()
                        .replace(/\s+/g, '-')}`}
                    >
                      {status}
                    </span>
                  </div>

                  <div className="application-details">
                    <p>
                      <span>📍</span>
                      {job?.location || 'Location not specified'}
                    </p>

                    {job?.jobType && (
                      <p>
                        <span>💼</span>
                        {job.jobType}
                      </p>
                    )}

                    <p>
                      <span>📅</span>
                      Applied on:{' '}
                      {appliedDate
                        ? new Date(appliedDate).toLocaleDateString()
                        : 'Date unavailable'}
                    </p>
                  </div>

                  {application.coverNote && (
                    <div className="application-cover-note">
                      <h4>Your Cover Note</h4>
                      <p>{application.coverNote}</p>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}

export default MyApplications;
