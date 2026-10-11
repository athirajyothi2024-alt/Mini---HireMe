import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance';
import Navbar from '../components/Navbar';
import './styles/Applicants.css';
import { toast } from 'react-toastify';

function Applicants() {
  const { jobId } = useParams();

  const [applications, setApplications] = useState([]);

  const fetchApplicants = async () => {
    try {
      const response = await axiosInstance.get(`/applications/job/${jobId}`);

      setApplications(response.data.applications);
    } catch (error) {
      console.log(error);
    }
  };

  const updateStatus = async (applicationId, status) => {
    try {
      await axiosInstance.put(`/applications/${applicationId}/status`, {
        status: status,
      });

      toast.success('Status updated successfully');

      fetchApplicants();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  return (
    <>
      <Navbar />

      <div className="applicants-container">
        <h1>Applicants</h1>

        {applications.length > 0 ? (
          applications.map(application => (
            <div className="applicant-card" key={application._id}>
              <h2>{application.applicant.name}</h2>

              <p>
                <strong>Email:</strong> {application.applicant.email}
              </p>

              <p>
                <strong>Cover Note:</strong>{' '}
                {application.coverNote || 'No cover note'}
              </p>

              <p>
                <strong>Status:</strong>
                <span className={`status ${application.status.toLowerCase()}`}>
                  {application.status}
                </span>
              </p>

              <div className="status-buttons">
                <button
                  onClick={() => updateStatus(application._id, 'Reviewed')}
                  disabled={application.status === 'Reviewed'}
                >
                  Review
                </button>

                <button
                  onClick={() => updateStatus(application._id, 'Shortlisted')}
                  disabled={application.status === 'Shortlisted'}
                >
                  Shortlist
                </button>
              </div>
            </div>
          ))
        ) : (
          <h3>No applicants yet.</h3>
        )}
      </div>
    </>
  );
}

export default Applicants;
