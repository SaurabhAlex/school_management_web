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
  const { logout } = useAuth();
  const [openMasters, setOpenMasters] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

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
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: spacing.drawer.width,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: spacing.drawer.width,
            boxSizing: 'border-box',
            bgcolor: colors.background.drawer,
            color: colors.primary.contrastText,
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        <Box sx={{ p: spacing.padding.small, borderBottom: `1px solid ${colors.divider}` }}>
          <Typography 
            variant="h6" 
            sx={{ 
              color: colors.primary.contrastText, 
              fontWeight: typography.fontWeight.medium 
            }}
          >
            School Management
          </Typography>
        </Box>
        <List sx={{ flex: 1 }}>
          {/* Masters Section */}
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleMastersClick}
              sx={{
                py: 1.5,
                '&:hover': {
                  bgcolor: colors.action.hover,
                },
              }}
            >
              <ListItemIcon sx={{ color: colors.primary.contrastText, minWidth: 40 }}>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Masters" 
                sx={{ 
                  '& .MuiListItemText-primary': { 
                    fontSize: typography.fontSize.small,
                    fontWeight: openMasters ? typography.fontWeight.medium : typography.fontWeight.regular
                  } 
                }}
              />
              {openMasters ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>

          {/* Masters Subitems */}
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

          {/* Main Items */}
          {mainItems.map((item) => (
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
        <Box sx={{ 
          p: spacing.padding.small, 
          borderTop: `1px solid ${colors.divider}`,
          mt: 'auto'
        }}>
          <ListItemButton
            onClick={handleUserMenuClick}
            sx={{
              borderRadius: 1,
              '&:hover': {
                bgcolor: colors.action.hover,
              },
            }}
          >
            <Avatar sx={{ 
              width: 32, 
              height: 32, 
              bgcolor: colors.secondary.main,
              mr: spacing.padding.small 
            }}>
              <PersonIcon fontSize="small" />
            </Avatar>
            <ListItemText 
              primary="Super" 
              secondary="Admin"
              sx={{ 
                '& .MuiListItemText-primary': { 
                  fontSize: typography.fontSize.small,
                  color: colors.primary.contrastText
                },
                '& .MuiListItemText-secondary': {
                  fontSize: typography.fontSize.small,
                  color: colors.primary.contrastText,
                  opacity: 0.7
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
          <MenuItem onClick={handleExportedReports}>
            <ListItemIcon>
              <DescriptionIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Exported Reports</ListItemText>
          </MenuItem>
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