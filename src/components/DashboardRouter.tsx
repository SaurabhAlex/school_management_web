import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const DashboardRouter = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check user role and redirect to appropriate dashboard/page
  switch (user.role) {
    case 'admin':
      return <Navigate to="/students" replace />;
    case 'faculty':
      return <Navigate to="/faculty-dashboard" replace />;
    case 'student':
      return <Navigate to="/student-dashboard" replace />;
    default:
      // If role is not set or invalid, redirect to login
      return <Navigate to="/login" replace />;
  }
}; 