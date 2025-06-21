import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FacultyDashboard } from '../pages/FacultyDashboard';
import { StudentDashboard } from '../pages/StudentDashboard';

export const DashboardRouter = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check user role and render appropriate dashboard
  switch (user.role) {
    case 'admin':
      return <Navigate to="/students" replace />;
    case 'faculty':
      return <FacultyDashboard />;
    case 'student':
      return <StudentDashboard />;
    default:
      // If role is not set or invalid, redirect to login
      return <Navigate to="/login" replace />;
  }
}; 