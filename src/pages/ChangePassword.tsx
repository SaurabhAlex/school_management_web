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
  Paper,
  Card,
  CardContent
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import { colors } from '../utils/theme';

const StyledCard = styled(Card)({
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
  width: '100%',
  maxWidth: '500px'
});

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'rgba(0, 0, 0, 0.23)',
    },
    '&:hover fieldset': {
      borderColor: colors.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: colors.primary.main,
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(0, 0, 0, 0.7)',
    '&.Mui-focused': {
      color: colors.primary.main,
    },
  },
  '& .MuiFormHelperText-root': {
    color: '#f44336',
  },
});

const SubmitButton = styled(Button)({
  backgroundColor: colors.primary.main,
  color: colors.primary.contrastText,
  padding: '10px 24px',
  borderRadius: '8px',
  textTransform: 'none',
  fontSize: '16px',
  fontWeight: 500,
  '&:hover': {
    backgroundColor: colors.primary.dark,
  },
  '&.Mui-disabled': {
    backgroundColor: `${colors.primary.main}80`,
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
      const endpoint = user.role === 'faculty' 
        ? '/api/auth/faculty/change-password'
        : '/api/auth/change-password';

      const response = await api.post(endpoint, {
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
      minHeight: 'calc(100vh - 64px)', // Adjust for header height
      backgroundColor: colors.background.default,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      py: 4
    }}>
      <Container maxWidth="sm">
        <StyledCard>
          <CardContent sx={{ p: 4 }}>
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 3, 
                fontWeight: 600, 
                textAlign: 'center',
                color: colors.primary.main
              }}
            >
              Change Password
            </Typography>

            {apiError && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3, 
                  backgroundColor: 'rgba(244, 67, 54, 0.1)', 
                  color: '#f44336' 
                }}
              >
                {apiError}
              </Alert>
            )}

            {successMessage && (
              <Alert 
                severity="success" 
                sx={{ 
                  mb: 3, 
                  backgroundColor: 'rgba(76, 175, 80, 0.1)', 
                  color: '#4caf50' 
                }}
              >
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

                <SubmitButton
                  type="submit"
                  disabled={isLoading}
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  {isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Change Password'
                  )}
                </SubmitButton>
              </Box>
            </form>
          </CardContent>
        </StyledCard>
      </Container>
    </Box>
  );
}; 