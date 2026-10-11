import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  RocketOutlined,
  UserAddOutlined,
  TeamOutlined,
  SolutionOutlined,
} from '@ant-design/icons';

import axiosInstance from '../services/axiosInstance';
import './styles/Register.css';

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Student',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    if (!formData.email.trim()) {
      toast.error('Please enter your email');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must contain at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await axiosInstance.post('/auth/register', {
        ...formData,
        name: formData.name.trim(),
        email: formData.email.trim(),
      });

      toast.success('Registration successful!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="register-container">
      <div className="register-background-shape register-shape-one" />
      <div className="register-background-shape register-shape-two" />

      <section className="register-card">
        <div className="register-brand">
          <div className="register-brand-icon">
            <RocketOutlined />
          </div>
          <span>HireMe</span>
        </div>

        <header className="register-heading">
          <span className="register-eyebrow">GET STARTED TODAY</span>

          <h1>Create your account</h1>

          <p>Join HireMe and take the next step in your career.</p>
        </header>

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="register-field">
            <label htmlFor="register-name">Full name</label>

            <div className="register-input-wrapper">
              <UserOutlined className="register-input-icon" />

              <input
                id="register-name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
                required
              />
            </div>
          </div>

          <div className="register-field">
            <label htmlFor="register-email">Email address</label>

            <div className="register-input-wrapper">
              <MailOutlined className="register-input-icon" />

              <input
                id="register-email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="register-field">
            <label htmlFor="register-password">Password</label>

            <div className="register-input-wrapper">
              <LockOutlined className="register-input-icon" />

              <input
                id="register-password"
                name="password"
                type="password"
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                minLength={6}
                required
              />

              <EyeInvisibleOutlined className="register-password-hint" />
            </div>

            <span className="register-field-hint">
              Use at least 6 characters.
            </span>
          </div>

          <div className="register-field">
            <label htmlFor="register-role">I want to join as</label>

            <div className="register-role-options">
              <label
                className={`register-role-option ${
                  formData.role === 'Student' ? 'selected' : ''
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="Student"
                  checked={formData.role === 'Student'}
                  onChange={handleChange}
                />

                <span className="register-role-icon">
                  <TeamOutlined />
                </span>

                <span className="register-role-text">
                  <strong>Student</strong>
                  <small>Find job opportunities</small>
                </span>

                <span className="register-role-check" />
              </label>

              <label
                className={`register-role-option ${
                  formData.role === 'Recruiter' ? 'selected' : ''
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="Recruiter"
                  checked={formData.role === 'Recruiter'}
                  onChange={handleChange}
                />

                <span className="register-role-icon">
                  <SolutionOutlined />
                </span>

                <span className="register-role-text">
                  <strong>Recruiter</strong>
                  <small>Post jobs and find talent</small>
                </span>

                <span className="register-role-check" />
              </label>
            </div>
          </div>

          <button type="submit" className="register-btn" disabled={loading}>
            {loading ? (
              <>
                <span className="register-spinner" />
                Creating account...
              </>
            ) : (
              <>
                <UserAddOutlined />
                Create Account
              </>
            )}
          </button>
        </form>

        <p className="login-link">
          Already have an account?
          <Link to="/">Login</Link>
        </p>

        <footer className="register-footer">
          <span className="register-footer-dot" />
          Start building your future with HireMe
        </footer>
      </section>
    </main>
  );
}

export default Register;
