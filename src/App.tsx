import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Role } from './pages/Role';
import { Faculty } from './pages/Faculty';
import { Students } from './pages/Students';
import { Class } from './pages/Class';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';
import { MainLayout } from './layouts/MainLayout';
import { DashboardRouter } from './components/DashboardRouter';
import { FacultyDashboard } from './pages/FacultyDashboard';
import { ErrorBoundary } from './components/ErrorBoundary';
import { NewStudentDashboard } from './pages/NewStudentDashboard';
import { ChangePassword } from './pages/ChangePassword';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <Routes>
              <Route path="/" element={<DashboardRouter />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                {/* Student Dashboard - Direct Route */}
                <Route path="/new-student-dashboard" element={<NewStudentDashboard />} />
                <Route path="/change-password" element={<ChangePassword />} />
                
                {/* Admin and Faculty Routes with MainLayout */}
                <Route element={<MainLayout />}>
                  <Route path="/" element={<DashboardRouter />} />
                  <Route path="/faculty-dashboard" element={<FacultyDashboard />} />
                  
                  {/* Admin-only routes */}
                  <Route element={<AdminRoute />}>
                    <Route path="/role" element={<Role />} />
                    <Route path="/faculty" element={<Faculty />} />
                    <Route path="/students" element={<Students />} />
                    <Route path="/class" element={<Class />} />
                  </Route>
                </Route>
              </Route>

              {/* Catch-all redirect to dashboard */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
