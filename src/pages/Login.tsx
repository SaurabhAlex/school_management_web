import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Link,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import type { LoginCredentials } from '../services/auth';
import { useAuth } from '../hooks/useAuth';

interface ExtendedLoginCredentials extends LoginCredentials {
  role: 'student' | 'faculty' | 'admin';
}

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [error, setError] = useState<string>('');
  const { register, handleSubmit, formState: { errors }, watch } = useForm<ExtendedLoginCredentials>({
    defaultValues: {
      role: 'student'
    }
  });
  const [showPassword, setShowPassword] = useState(false);
  const from = location.state?.from?.pathname || '/';

  const onSubmit = async (data: ExtendedLoginCredentials) => {
    try {
      await login(data.email, data.password, data.role);
      navigate(from, { replace: true });
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: '#f4f6fa' }}>
      {/* Left illustration */}
      <Box sx={{ flex: 1, display: { xs: 'none', md: 'flex' }, alignItems: 'center', justifyContent: 'center', bgcolor: '#283593' }}>
        <img src="/dps-illustration.svg" alt="Delhi Public School Illustration" style={{ width: '80%', maxWidth: 400 }} />
      </Box>
      {/* Right form */}
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Paper elevation={3} sx={{ p: 5, borderRadius: 4, minWidth: 350, maxWidth: 400, width: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <img src="/dps-logo.svg" alt="Delhi Public School Logo" style={{ height: 48 }} />
          </Box>
          <Typography variant="h5" fontWeight={700} align="center" sx={{ mb: 1 }}>
            Welcome To Delhi Public School
          </Typography>
          <Typography variant="subtitle1" align="center" sx={{ mb: 3, color: 'text.secondary' }}>
            Enter your credentials to login your account
          </Typography>
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>
          )}
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="role-label">Login as</InputLabel>
              <Select
                labelId="role-label"
                label="Login as"
                defaultValue="student"
                {...register('role')}
              >
                <MenuItem value="student">Student</MenuItem>
                <MenuItem value="faculty">Faculty</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email address"
              autoComplete="email"
              autoFocus
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword((show) => !show)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
              <Link href="#" underline="hover" sx={{ fontSize: 14 }}>
                Forgot your password?
              </Link>
            </Box>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, fontWeight: 700, fontSize: 16, bgcolor: '#283593', ':hover': { bgcolor: '#1a237e' } }}
            >
              Login
            </Button>
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2">
                Don&apos;t have an account?{' '}
                <Link href="/register" underline="hover" sx={{ fontWeight: 700 }}>
                  Register
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}; 