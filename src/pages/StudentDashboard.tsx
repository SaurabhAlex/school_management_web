import {
  Box,
  Typography,
  Paper,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleCloseMenu();
    logout();
  };

  const getDisplayName = () => {
    if (!user) return 'N';
    return user.name || 'N';
  };

  const getDisplayInitial = () => {
    const displayName = getDisplayName();
    return displayName.charAt(0).toUpperCase();
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f4f6fa', p: 4 }}>
      {/* Profile/Logout menu in top right */}
      <Box sx={{ position: 'absolute', top: 24, right: 24 }}>
        <IconButton onClick={handleMenu}>
          <Avatar sx={{ bgcolor: '#3949ab' }}>{getDisplayInitial()}</Avatar>
        </IconButton>
        <Menu anchorEl={anchorEl} open={openMenu} onClose={handleCloseMenu}>
          <MenuItem>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              {getDisplayName()}
            </Typography>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleCloseMenu}>Profile</MenuItem>
          <MenuItem onClick={handleCloseMenu}>Change Password</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Box>

      {/* Welcome Message */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          mt: 8, 
          maxWidth: 600, 
          mx: 'auto', 
          textAlign: 'center',
          bgcolor: '#fff'
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom color="primary">
          Welcome to the Student Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Hello {getDisplayName()}, welcome to your personalized student portal.
        </Typography>
      </Paper>
    </Box>
  );
}; 