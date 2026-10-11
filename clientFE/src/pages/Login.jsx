import { useState } from 'react';
import { Button, Card, Form, Input, Typography } from 'antd';
import {
  MailOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  LoginOutlined,
  RocketOutlined,
} from '@ant-design/icons';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';

import axiosInstance from '../services/axiosInstance';
import './styles/Login.css';

const { Title, Text } = Typography;

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async values => {
    setLoading(true);

    try {
      const response = await axiosInstance.post('/auth/login', values);

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      toast.success(response.data.message || 'Login successful!');

      if (response.data.user.role === 'Student') {
        navigate('/studentDashboard');
      } else {
        navigate('/recruiterDashboard');
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-background-shape login-shape-one" />
      <div className="login-background-shape login-shape-two" />

      <Card className="login-card" bordered={false}>
        <div className="login-brand">
          <div className="login-brand-icon">
            <RocketOutlined />
          </div>
          <span>HireMe</span>
        </div>

        <div className="login-heading">
          <Text className="login-eyebrow">WELCOME BACK</Text>

          <Title level={1} className="login-title">
            Login to your account
          </Title>

          <Text className="login-subtitle">
            Your next opportunity starts here.
          </Text>
        </div>

        <Form
          layout="vertical"
          requiredMark={false}
          onFinish={handleLogin}
          className="login-form"
          autoComplete="on"
        >
          <Form.Item
            label="Email address"
            name="email"
            rules={[
              { required: true, message: 'Please enter your email address' },
              { type: 'email', message: 'Please enter a valid email address' },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="you@example.com"
              size="large"
              autoComplete="email"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter your password"
              size="large"
              autoComplete="current-password"
              iconRender={visible =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={loading}
            icon={!loading && <LoginOutlined />}
            className="login-submit-btn"
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>

          <div className="login-register">
            <Text>Don't have an account?</Text>
            <Link to="/register">Create an account</Link>
          </div>
        </Form>

        <div className="login-footer">
          <span className="login-footer-dot" />
          <Text>Find your next opportunity with HireMe</Text>
        </div>
      </Card>
    </main>
  );
}

export default Login;
