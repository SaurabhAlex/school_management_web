import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Container,
  Paper
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

const StyledPaper = styled(Paper)({
  backgroundColor: '#1A1F37',
  color: '#fff',
  borderRadius: '12px',
  padding: '32px',
  width: '100%',
  maxWidth: '500px'
});

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    color: '#fff',
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.23)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.4)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#3949ab',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
    '&.Mui-focused': {
      color: '#3949ab',
    },
  },
  '& .MuiFormHelperText-root': {
    color: '#f44336',
  },
});

const SubmitButton = styled(Button)({
  backgroundColor: '#3949ab',
  color: '#fff',
  padding: '10px 24px',
  borderRadius: '8px',
  textTransform: 'none',
  fontSize: '16px',
  fontWeight: 500,
  '&:hover': {
    backgroundColor: '#2f3660',
  },
  '&.Mui-disabled': {
    backgroundColor: 'rgba(57, 73, 171, 0.5)',
    color: 'rgba(255, 255, 255, 0.5)',
  },
});

export const ChangePassword = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!user) {
    return <Typography>Access Denied</Typography>;
  }

  const validateForm = () => {
    const newErrors = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    };

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
    setApiError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    setSuccessMessage('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/api/auth/change-password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });

      setSuccessMessage('Password changed successfully');
      setTimeout(() => {
        navigate(-1); // Go back to previous page
      }, 2000);
    } catch (error: any) {
      setApiError(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Failed to change password'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      backgroundColor: '#111422',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      py: 4
    }}>
      <Container maxWidth="sm">
        <StyledPaper elevation={0}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, textAlign: 'center' }}>
            Change Password
          </Typography>

          {apiError && (
            <Alert severity="error" sx={{ mb: 3, backgroundColor: 'rgba(244, 67, 54, 0.1)', color: '#f44336' }}>
              {apiError}
            </Alert>
          )}

          {successMessage && (
            <Alert severity="success" sx={{ mb: 3, backgroundColor: 'rgba(76, 175, 80, 0.1)', color: '#4caf50' }}>
              {successMessage}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <StyledTextField
                label="Current Password"
                type="password"
                value={formData.currentPassword}
                onChange={handleChange('currentPassword')}
                error={!!errors.currentPassword}
                helperText={errors.currentPassword}
                fullWidth
              />

              <StyledTextField
                label="New Password"
                type="password"
                value={formData.newPassword}
                onChange={handleChange('newPassword')}
                error={!!errors.newPassword}
                helperText={errors.newPassword}
                fullWidth
              />

              <StyledTextField
                label="Confirm New Password"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange('confirmPassword')}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                fullWidth
              />

              <Box sx={{ mt: 2 }}>
                <SubmitButton
                  type="submit"
                  fullWidth
                  disabled={isLoading}
                  startIcon={isLoading && <CircularProgress size={20} color="inherit" />}
                >
                  {isLoading ? 'Changing Password...' : 'Change Password'}
                </SubmitButton>
              </Box>
            </Box>
          </form>
        </StyledPaper>
      </Container>
    </Box>
  );
}; 