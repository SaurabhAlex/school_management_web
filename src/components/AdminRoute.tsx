import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const AdminRoute = () => {
  const { user } = useAuth();

  // If user is not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user is not an admin, redirect to their appropriate dashboard
  if (user.role !== 'admin') {
    switch (user.role) {
      case 'faculty':
        return <Navigate to="/faculty-dashboard" replace />;
      case 'student':
        return <Navigate to="/student-dashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  // If user is admin, allow access to the protected route
  return <Outlet />;
}; 