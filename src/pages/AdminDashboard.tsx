import { useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Avatar,
} from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import SchoolIcon from '@mui/icons-material/School';
import ClassIcon from '@mui/icons-material/Class';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [selectedTab, setSelectedTab] = useState('students');
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

  const handleTabClick = (tab: string) => {
    setSelectedTab(tab);
    navigate(`/${tab}`);
  };

  // Get display name based on user type
  const getDisplayName = () => {
    if (!user) return 'N';
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.name || 'N';
  };

  const getDisplayInitial = () => {
    const displayName = getDisplayName();
    return displayName.charAt(0).toUpperCase();
  };

  const tabs = [
    { id: 'students', label: 'Students', icon: <GroupIcon />, path: '/students' },
    { id: 'faculty', label: 'Faculty', icon: <SchoolIcon />, path: '/faculty' },
    { id: 'class', label: 'Class', icon: <ClassIcon />, path: '/class' },
    { id: 'role', label: 'Role', icon: <AdminPanelSettingsIcon />, path: '/role' },
    { id: 'masters', label: 'Masters', icon: <SupervisorAccountIcon />, path: '/masters' },
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f4f6fa' }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: 280,
          bgcolor: '#1a237e',
          color: '#fff',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
          School Management
        </Typography>
        <List sx={{ p: 0 }}>
          {tabs.map((tab) => (
            <ListItem
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              sx={{
                py: 1.5,
                bgcolor: selectedTab === tab.id ? '#283593' : 'transparent',
                '&:hover': {
                  cursor: 'pointer',
                  bgcolor: '#283593',
                },
              }}
            >
              <ListItemIcon sx={{ color: '#fff' }}>{tab.icon}</ListItemIcon>
              <ListItemText
                primary={tab.label}
                sx={{ '& .MuiListItemText-primary': { fontWeight: selectedTab === tab.id ? 'bold' : 'normal' } }}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      <Box sx={{ flex: 1, p: 4, position: 'relative' }}>
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
            <MenuItem onClick={handleCloseMenu}>Commission Structure</MenuItem>
            <MenuItem onClick={handleCloseMenu}>Change Password</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>

        {/* Main content area - will be filled by the routed components */}
        <Box sx={{ mt: 6 }}>
          {/* The content of each tab will be rendered by the router */}
        </Box>
      </Box>
    </Box>
  );
}; 