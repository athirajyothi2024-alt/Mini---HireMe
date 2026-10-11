import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../src/pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import Jobs from './pages/Jobs';
import Profile from './pages/Profile';
import MyApplications from './pages/MyApplications';
import CreateJob from './pages/CreateJob';
import Applicants from './pages/Applicants';
import EditJob from './pages/EditJob';
import './App.css';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/studentDashboard" element={<StudentDashboard />} />
        <Route path="/recruiterDashboard" element={<RecruiterDashboard />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/createJob" element={<CreateJob />} />
        <Route path="/applicants/:jobId" element={<Applicants />} />
        <Route path="/editJob/:id" element={<EditJob />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/myApplications" element={<MyApplications />} />
        {/* <Route path="/register" element={<Register/>}/> */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
