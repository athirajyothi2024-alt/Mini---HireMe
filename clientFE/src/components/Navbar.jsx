import { Button, Layout, Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const { Header } = Layout;

function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const menuItems =
    user?.role === 'Student'
      ? [
          {
            key: 'jobs',
            label: 'Jobs',
            onClick: () => navigate('/studentDashboard'),
          },
          {
            key: 'applications',
            label: 'My Applications',
            onClick: () => navigate('/myApplications'),
          },
          {
            key: 'profile',
            label: 'Profile',
            onClick: () => navigate('/profile'),
          },
        ]
      : [
          {
            key: 'myJobs',
            label: 'Home',
            onClick: () => navigate('/recruiterDashboard'),
          },
          {
            key: 'createJob',
            label: 'Create Job',
            onClick: () => navigate('/createJob'),
          },

          {
            key: 'profile',
            label: 'Profile',
            onClick: () => navigate('/profile'),
          },
        ];

  return (
    <Header className="navbar-header">
      <h2
        className="navbar-logo"
        onClick={() =>
          navigate(
            user?.role === 'Student'
              ? '/studentDashboard'
              : '/recruiterDashboard'
          )
        }
        style={{ cursor: 'pointer' }}
      >
        HireMe
      </h2>

      <Menu
        className="navbar-menu"
        theme="dark"
        mode="horizontal"
        items={menuItems}
      />

      <div className="navbar-user">
        <span style={{ color: 'white', marginRight: 15 }}>{user?.name}</span>

        <Button className="logout-btn" onClick={logout}>
          Logout
        </Button>
      </div>
    </Header>
  );
}

export default Navbar;
