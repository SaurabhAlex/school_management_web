import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FacultyDashboard } from '../pages/FacultyDashboard';
import { StudentDashboard } from '../pages/StudentDashboard';
import { AdminDashboard } from '../pages/AdminDashboard';

export const DashboardRouter = () => {
  const { user } = useAuth();

  if (!user) {
    console.log('No user found, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Log user data for debugging
  console.log('Current user:', user);
  console.log('User role:', user.role);

  // Check user role and render appropriate dashboard
  if (user.role === 'admin') {
    console.log('Rendering admin dashboard');
    return <AdminDashboard />;
  } else if (user.role === 'faculty') {
    console.log('Rendering faculty dashboard');
    return <FacultyDashboard />;
  } else if (user.role === 'student') {
    console.log('Rendering student dashboard');
    return <StudentDashboard />;
  } else {
    // If role is not set or invalid, redirect to login
    console.log('Invalid or missing role, redirecting to login');
    return <Navigate to="/login" replace />;
  }
}; 