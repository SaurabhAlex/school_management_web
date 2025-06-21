import React from 'react';
import { 
  Box, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  ListItemButton, 
  Drawer, 
  Typography, 
  Collapse,
  Menu,
  MenuItem,
  IconButton,
  Avatar
} from '@mui/material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import ClassIcon from '@mui/icons-material/Class';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import KeyIcon from '@mui/icons-material/Key';
import LogoutIcon from '@mui/icons-material/Logout';
import DescriptionIcon from '@mui/icons-material/Description';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { colors, spacing, typography } from '../utils/theme';
import { useAuth } from '../hooks/useAuth';

const mainItems = [
  { text: 'Students', icon: <PeopleIcon />, path: '/students' },
  { text: 'Faculty', icon: <SchoolIcon />, path: '/faculty' }
];

const masterItems = [
  { text: 'Role', icon: <AdminPanelSettingsIcon />, path: '/role' },
  { text: 'Class', icon: <ClassIcon />, path: '/class' }
];

export const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [openMasters, setOpenMasters] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const isAdmin = user?.role === 'admin';

  const handleMastersClick = () => {
    setOpenMasters(!openMasters);
    if (!openMasters) {
      navigate('/role');
    }
  };

  const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleUserMenuClose();
    await logout();
    navigate('/login');
  };

  const handleProfile = () => {
    handleUserMenuClose();
    navigate('/profile');
  };

  const handleChangePassword = () => {
    handleUserMenuClose();
    navigate('/change-password');
  };

  const handleExportedReports = () => {
    handleUserMenuClose();
    navigate('/exported-reports');
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: 280,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 280,
            boxSizing: 'border-box',
            bgcolor: colors.primary.main,
            color: colors.primary.contrastText,
          },
        }}
      >
        <Box sx={{ p: spacing.padding.medium }}>
          <Typography variant="h6" sx={{ fontWeight: typography.fontWeight.bold, pb: spacing.padding.medium }}>
            School Management
          </Typography>
        </Box>

        <List>
          {/* Only show Masters section for admin */}
          {isAdmin && (
            <>
              <ListItem disablePadding>
                <ListItemButton onClick={handleMastersClick}>
                  <ListItemIcon sx={{ color: colors.primary.contrastText, minWidth: 40 }}>
                    <SettingsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Masters" />
                  {openMasters ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              </ListItem>

              <Collapse in={openMasters} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {masterItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                      <ListItemButton
                        onClick={() => navigate(item.path)}
                        selected={location.pathname === item.path}
                        sx={{
                          pl: 4,
                          py: 1.5,
                          '&.Mui-selected': {
                            bgcolor: colors.action.selected,
                            '&:hover': {
                              bgcolor: colors.action.selectedHover,
                            },
                          },
                          '&:hover': {
                            bgcolor: colors.action.hover,
                          },
                        }}
                      >
                        <ListItemIcon sx={{ color: colors.primary.contrastText, minWidth: 40 }}>
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText 
                          primary={item.text} 
                          sx={{ 
                            '& .MuiListItemText-primary': { 
                              fontSize: typography.fontSize.small,
                              fontWeight: location.pathname === item.path ? typography.fontWeight.medium : typography.fontWeight.regular
                            } 
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </>
          )}

          {/* Show only Students for faculty, show all main items for admin */}
          {(isAdmin ? mainItems : mainItems.slice(0, 1)).map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => navigate(item.path)}
                selected={location.pathname === item.path}
                sx={{
                  py: 1.5,
                  '&.Mui-selected': {
                    bgcolor: colors.action.selected,
                    '&:hover': {
                      bgcolor: colors.action.selectedHover,
                    },
                  },
                  '&:hover': {
                    bgcolor: colors.action.hover,
                  },
                }}
              >
                <ListItemIcon sx={{ color: colors.primary.contrastText, minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  sx={{ 
                    '& .MuiListItemText-primary': { 
                      fontSize: typography.fontSize.small,
                      fontWeight: location.pathname === item.path ? typography.fontWeight.medium : typography.fontWeight.regular
                    } 
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        {/* User Menu */}
        <Box sx={{ mt: 'auto', p: 2 }}>
          <ListItemButton onClick={handleUserMenuClick}>
            <ListItemIcon sx={{ color: colors.primary.contrastText }}>
              <Avatar sx={{ bgcolor: colors.secondary.main }}>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </Avatar>
            </ListItemIcon>
            <ListItemText 
              primary={user?.name || 'User'} 
              sx={{ 
                '& .MuiListItemText-primary': { 
                  fontSize: typography.fontSize.small,
                  fontWeight: typography.fontWeight.medium
                } 
              }}
            />
          </ListItemButton>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleUserMenuClose}
          onClick={handleUserMenuClose}
          PaperProps={{
            sx: {
              mt: -2,
              minWidth: 200,
            }
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={handleProfile}>
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Profile</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleChangePassword}>
            <ListItemIcon>
              <KeyIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Change Password</ListItemText>
          </MenuItem>
          {isAdmin && (
            <MenuItem onClick={handleExportedReports}>
              <ListItemIcon>
                <DescriptionIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Exported Reports</ListItemText>
            </MenuItem>
          )}
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText sx={{ color: 'error.main' }}>Logout</ListItemText>
          </MenuItem>
        </Menu>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: colors.background.default,
          p: spacing.padding.medium,
          minHeight: '100vh',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}; 