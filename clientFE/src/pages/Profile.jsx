import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import axiosInstance from '../services/axiosInstance';
import './styles/Profile.css';
import {
  EditOutlined,
  CloseOutlined,
  UserOutlined,
  EnvironmentOutlined,
  MailOutlined,
  GithubOutlined,
  LinkedinOutlined,
  FilePdfOutlined,
  UploadOutlined,
  SaveOutlined,
  BankOutlined,
} from '@ant-design/icons';

function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    role: '',
    bio: '',
    location: '',
    github: '',
    linkedin: '',
    skills: [],
    company: '',
    resume: '',
  });

  const originalProfile = useRef(null);
  const resumeInputRef = useRef(null);

  const fetchProfile = async () => {
    try {
      const response = await axiosInstance.get('/profile');
      const data = response.data?.user || response.data;

      const normalizedProfile = {
        name: data.name || '',
        email: data.email || '',
        role: data.role || '',
        bio: data.bio || '',
        location: data.location || '',
        github: data.github || '',
        linkedin: data.linkedin || '',
        skills: Array.isArray(data.skills)
          ? data.skills
          : typeof data.skills === 'string'
            ? data.skills
                .split(',')
                .map(s => s.trim())
                .filter(Boolean)
            : [],
        company: data.company || '',
        resume: data.resume || '',
        profileImage: data.profileImage || '',
      };

      setProfile(normalizedProfile);
      originalProfile.current = normalizedProfile;
    } catch (error) {
      console.error('Profile loading failed:', error);
      toast.error(error.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = event => {
    const { name, value } = event.target;

    setProfile(previous => ({
      ...previous,
      [name]: value,
    }));
  };

  const cancelEditing = () => {
    if (originalProfile.current) {
      setProfile(originalProfile.current);
    }

    setIsEditing(false);

    if (resumeInputRef.current) {
      resumeInputRef.current.value = '';
    }
  };

  const handleResumeUpload = async event => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (
      file.type !== 'application/pdf' &&
      !file.name.toLowerCase().endsWith('.pdf')
    ) {
      toast.error('Please select a PDF file.');
      event.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Resume must be smaller than 5 MB.');
      event.target.value = '';
      return;
    }

    setUploadingResume(true);

    try {
      const formData = new FormData();
      formData.append('resume', file);

      await axiosInstance.put('/profile/upload-resume', formData);

      toast.success('Resume uploaded successfully');
      await fetchProfile();
    } catch (error) {
      console.error('Resume upload failed:', error);
      toast.error(error.response?.data?.message || 'Resume upload failed');
    } finally {
      setUploadingResume(false);

      if (resumeInputRef.current) {
        resumeInputRef.current.value = '';
      }
    }
  };

  const updateProfile = async event => {
    event.preventDefault();

    setSaving(true);

    try {
      const updatedData = {
        name: profile.name.trim(),
        bio: profile.bio.trim(),
        location: profile.location.trim(),
        github: profile.github.trim(),
        linkedin: profile.linkedin.trim(),
        company: profile.company.trim(),
        skills: Array.isArray(profile.skills)
          ? profile.skills
          : profile.skills
              .split(',')
              .map(skill => skill.trim())
              .filter(Boolean),
      };

      await axiosInstance.put('/profile/update', updatedData);

      toast.success('Profile updated successfully');
      setIsEditing(false);
      await fetchProfile();
    } catch (error) {
      console.error('Profile update failed:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const skills = Array.isArray(profile.skills)
    ? profile.skills
    : typeof profile.skills === 'string'
      ? profile.skills
          .split(',')
          .map(skill => skill.trim())
          .filter(Boolean)
      : [];

  const resumeName = profile.resume ? profile.resume.split(/[\\/]/).pop() : '';

  const resumeUrl = profile.resume
    ? profile.resume.startsWith('http')
      ? profile.resume
      : `${(axiosInstance.defaults.baseURL || '').replace(/\/api\/?$/, '')}/${profile.resume.replace(/^\/+/, '')}`
    : '';

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="profile-loading">
          <div className="profile-spinner" />
          <p>Loading your profile...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="profile-page">
        <div className="profile-page-heading">
          <div>
            <span className="profile-eyebrow">ACCOUNT SETTINGS</span>
            <h1>My Profile</h1>
            <p>Manage your personal information and professional details.</p>
          </div>
        </div>

        <div className="profile-layout">
          <aside className="profile-summary-card">
            <div className="profile-summary-banner" />

            <div className="profile-avatar-wrapper">
              {profile.profileImage ? (
                <img
                  className="profile-avatar"
                  src={
                    profile.profileImage.startsWith('http')
                      ? profile.profileImage
                      : `${(axiosInstance.defaults.baseURL || '').replace(/\/api\/?$/, '')}/${profile.profileImage.replace(/^\/+/, '')}`
                  }
                  alt="Profile"
                  onError={event => {
                    event.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="profile-avatar profile-avatar-placeholder">
                  {profile.name?.charAt(0)?.toUpperCase() || <UserOutlined />}
                </div>
              )}
            </div>

            <div className="profile-summary-content">
              <h2>{profile.name || 'Your Name'}</h2>

              <span className="profile-role-badge">
                {profile.role || 'Member'}
              </span>

              <p className="profile-summary-bio">
                {profile.bio || 'Add a short bio to introduce yourself.'}
              </p>

              <div className="profile-summary-divider" />

              <div className="profile-summary-detail">
                <MailOutlined />
                <span>{profile.email || 'Email not available'}</span>
              </div>

              <div className="profile-summary-detail">
                <EnvironmentOutlined />
                <span>{profile.location || 'Location not added'}</span>
              </div>

              {profile.role === 'Recruiter' && (
                <div className="profile-summary-detail">
                  <BankOutlined />
                  <span>{profile.company || 'Company not added'}</span>
                </div>
              )}

              <button
                type="button"
                className="profile-edit-main-btn"
                onClick={() => setIsEditing(previous => !previous)}
              >
                {isEditing ? <CloseOutlined /> : <EditOutlined />}
                {isEditing ? 'Cancel Editing' : 'Edit Profile'}
              </button>
            </div>
          </aside>

          <section className="profile-details-card">
            <div className="profile-details-heading">
              <div>
                <h2>{isEditing ? 'Edit your details' : 'Personal details'}</h2>
                <p>
                  {isEditing
                    ? 'Keep your information up to date.'
                    : 'Your information and professional links.'}
                </p>
              </div>

              {!isEditing && (
                <button
                  type="button"
                  className="profile-icon-btn"
                  aria-label="Edit profile"
                  onClick={() => setIsEditing(true)}
                >
                  <EditOutlined />
                </button>
              )}
            </div>

            <form onSubmit={updateProfile}>
              <div className="profile-form-grid">
                <div className="profile-field">
                  <label htmlFor="profile-name">Full name</label>
                  {isEditing ? (
                    <input
                      id="profile-name"
                      name="name"
                      value={profile.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                    />
                  ) : (
                    <p>{profile.name || 'Not added'}</p>
                  )}
                </div>

                <div className="profile-field">
                  <label htmlFor="profile-email">Email address</label>
                  <div className="profile-readonly-field">
                    <MailOutlined />
                    <span>{profile.email || 'Not available'}</span>
                  </div>
                  <small>Email cannot be changed here.</small>
                </div>

                <div className="profile-field">
                  <label>Account role</label>
                  <p>{profile.role || 'Not available'}</p>
                </div>

                <div className="profile-field">
                  <label htmlFor="profile-location">Location</label>
                  {isEditing ? (
                    <input
                      id="profile-location"
                      name="location"
                      value={profile.location}
                      onChange={handleChange}
                      placeholder="City, Country"
                    />
                  ) : (
                    <p>{profile.location || 'Not added'}</p>
                  )}
                </div>

                <div className="profile-field profile-field-full">
                  <label htmlFor="profile-bio">Professional bio</label>
                  {isEditing ? (
                    <textarea
                      id="profile-bio"
                      name="bio"
                      value={profile.bio}
                      onChange={handleChange}
                      placeholder="Tell us a little about yourself..."
                      rows={4}
                    />
                  ) : (
                    <p className="profile-bio-display">
                      {profile.bio || 'No bio added yet.'}
                    </p>
                  )}
                </div>

                {profile.role === 'Student' ? (
                  <>
                    <div className="profile-field profile-field-full">
                      <label htmlFor="profile-skills">Skills</label>
                      {isEditing ? (
                        <>
                          <input
                            id="profile-skills"
                            name="skills"
                            value={
                              Array.isArray(profile.skills)
                                ? profile.skills.join(', ')
                                : profile.skills
                            }
                            onChange={handleChange}
                            placeholder="React, JavaScript, Node.js"
                          />
                          <small>Separate each skill with a comma.</small>
                        </>
                      ) : (
                        <div className="profile-skills">
                          {skills.length ? (
                            skills.map((skill, index) => (
                              <span key={`${skill}-${index}`}>{skill}</span>
                            ))
                          ) : (
                            <p>No skills added yet.</p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="profile-field">
                      <label htmlFor="profile-github">GitHub profile</label>
                      {isEditing ? (
                        <input
                          id="profile-github"
                          name="github"
                          type="url"
                          value={profile.github}
                          onChange={handleChange}
                          placeholder="https://github.com/username"
                        />
                      ) : (
                        <p className="profile-link-value">
                          {profile.github ? (
                            <a
                              href={
                                profile.github.startsWith('http')
                                  ? profile.github
                                  : `https://${profile.github}`
                              }
                              target="_blank"
                              rel="noreferrer"
                            >
                              <GithubOutlined /> View GitHub profile
                            </a>
                          ) : (
                            'Not added'
                          )}
                        </p>
                      )}
                    </div>

                    <div className="profile-field">
                      <label>Resume</label>

                      {isEditing ? (
                        <div className="profile-resume-upload">
                          <input
                            ref={resumeInputRef}
                            id="profile-resume"
                            type="file"
                            accept=".pdf,application/pdf"
                            onChange={handleResumeUpload}
                            hidden
                          />

                          <label
                            htmlFor="profile-resume"
                            className="profile-upload-btn"
                          >
                            <UploadOutlined />
                            Choose PDF
                          </label>

                          <small>
                            {uploadingResume
                              ? 'Uploading resume...'
                              : 'PDF only · Max 5 MB · Uploads immediately'}
                          </small>
                        </div>
                      ) : (
                        <div className="profile-resume-display">
                          <FilePdfOutlined className="profile-pdf-icon" />

                          <div className="profile-resume-info">
                            <span>{resumeName || 'No resume uploaded'}</span>
                            <small>
                              {resumeName
                                ? 'PDF document'
                                : 'Upload in edit mode'}
                            </small>
                          </div>

                          {resumeName && resumeUrl && (
                            <a
                              href={resumeUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="profile-resume-view"
                            >
                              View
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="profile-field">
                    <label htmlFor="profile-company">Company name</label>
                    {isEditing ? (
                      <input
                        id="profile-company"
                        name="company"
                        value={profile.company}
                        onChange={handleChange}
                        placeholder="Enter your company"
                      />
                    ) : (
                      <p>{profile.company || 'Not added'}</p>
                    )}
                  </div>
                )}

                <div className="profile-field">
                  <label htmlFor="profile-linkedin">LinkedIn profile</label>
                  {isEditing ? (
                    <input
                      id="profile-linkedin"
                      name="linkedin"
                      type="url"
                      value={profile.linkedin}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/in/username"
                    />
                  ) : (
                    <p className="profile-link-value">
                      {profile.linkedin ? (
                        <a
                          href={
                            profile.linkedin.startsWith('http')
                              ? profile.linkedin
                              : `https://${profile.linkedin}`
                          }
                          target="_blank"
                          rel="noreferrer"
                        >
                          <LinkedinOutlined /> View LinkedIn profile
                        </a>
                      ) : (
                        'Not added'
                      )}
                    </p>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="profile-form-actions">
                  <button
                    type="button"
                    className="profile-cancel-btn"
                    onClick={cancelEditing}
                    disabled={saving}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="profile-save-btn"
                    disabled={saving || uploadingResume}
                  >
                    <SaveOutlined />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </form>
          </section>
        </div>
      </main>
    </>
  );
}

export default Profile;
