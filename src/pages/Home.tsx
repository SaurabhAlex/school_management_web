import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Divider,
  Avatar,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
} from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import SchoolIcon from '@mui/icons-material/School';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SettingsIcon from '@mui/icons-material/Settings';
import ClassIcon from '@mui/icons-material/Class';
import WorkIcon from '@mui/icons-material/Work';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useStudents } from '../hooks/useStudents';
import { useAuth } from '../hooks/useAuth';
import Faculty from './Faculty';
import { Role } from './Role';
import { Class } from './Class';

export const Home = () => {
  const { students, addStudent, editStudent, deleteStudent } = useStudents();
  const { user, logout } = useAuth();
  const isFaculty = user?.role === 'faculty';

  // Initialize section state based on user role
  const [section, setSection] = useState<'students' | 'faculty' | 'role' | 'class'>('students');
  const [mastersOpen, setMastersOpen] = useState(!isFaculty);
  const [roleOpen, setRoleOpen] = useState(!isFaculty);
  const [classOpen, setClassOpen] = useState(!isFaculty);

  // Force section to 'students' if user is faculty
  useEffect(() => {
    if (isFaculty) {
      setSection('students');
    }
  }, [isFaculty]);

  // Prevent section change for faculty users
  const handleSectionChange = (newSection: typeof section) => {
    if (!isFaculty || newSection === 'students') {
      setSection(newSection);
    }
  };

  // Student form state
  const [editModeStudent, setEditModeStudent] = useState(false);
  const [studentForm, setStudentForm] = useState({ id: '', firstName: '', lastName: '', mobileNumber: '' });
  const [studentError, setStudentError] = useState('');

  // Profile/Logout menu state
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

  const handleMastersClick = () => {
    setMastersOpen(!mastersOpen);
  };

  const handleRoleClick = () => {
    setRoleOpen(!roleOpen);
  };

  const handleClassClick = () => {
    setClassOpen(!classOpen);
  };

  // Handlers for Students
  const handleEditStudent = (student: any) => {
    setStudentForm({ id: student.id, firstName: student.firstName, lastName: student.lastName, mobileNumber: student.mobileNumber });
    setEditModeStudent(true);
    setStudentError('');
  };
  const handleCancelStudent = () => {
    setStudentForm({ id: '', firstName: '', lastName: '', mobileNumber: '' });
    setEditModeStudent(false);
    setStudentError('');
  };
  const handleChangeStudent = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStudentForm({ ...studentForm, [e.target.name]: e.target.value });
  };
  const handleSubmitStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editModeStudent) {
        await editStudent({ id: studentForm.id, firstName: studentForm.firstName, lastName: studentForm.lastName, mobileNumber: studentForm.mobileNumber });
      } else {
        await addStudent({ firstName: studentForm.firstName, lastName: studentForm.lastName, mobileNumber: studentForm.mobileNumber });
      }
      setStudentForm({ id: '', firstName: '', lastName: '', mobileNumber: '' });
      setEditModeStudent(false);
    } catch (err: any) {
      setStudentError(err?.response?.data?.error || 'Failed to save student.');
    }
  };
  const handleDeleteStudent = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await deleteStudent(id);
      } catch (err) {
        setStudentError('Failed to delete student.');
      }
    }
  };

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
          <ListItem 
            onClick={() => handleSectionChange('students')}
            sx={{ 
              bgcolor: section === 'students' ? '#283593' : 'transparent',
              py: 1.5,
              '&:hover': {
                cursor: 'pointer',
                bgcolor: section === 'students' ? '#283593' : 'rgba(255,255,255,0.1)'
              }
            }}
          >
            <ListItemIcon>
              <GroupIcon sx={{ color: '#fff' }} />
            </ListItemIcon>
            <ListItemText primary="Students" sx={{ '& .MuiListItemText-primary': { fontWeight: 'bold' } }} />
          </ListItem>

          {/* Show additional navigation only for non-faculty users */}
          {!isFaculty && (
            <>
              <ListItem 
                onClick={() => handleSectionChange('faculty')}
                sx={{ 
                  bgcolor: section === 'faculty' ? '#283593' : 'transparent',
                  py: 1.5,
                  '&:hover': {
                    cursor: 'pointer',
                    bgcolor: section === 'faculty' ? '#283593' : 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                <ListItemIcon>
                  <SchoolIcon sx={{ color: '#fff' }} />
                </ListItemIcon>
                <ListItemText primary="Faculty" sx={{ '& .MuiListItemText-primary': { fontWeight: 'bold' } }} />
              </ListItem>
              <ListItem 
                onClick={handleMastersClick}
                sx={{ 
                  py: 1.5,
                  '&:hover': {
                    cursor: 'pointer',
                    bgcolor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                <ListItemIcon>
                  <SettingsIcon sx={{ color: '#fff' }} />
                </ListItemIcon>
                <ListItemText primary="Masters" sx={{ '& .MuiListItemText-primary': { fontWeight: 'bold' } }} />
                {mastersOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={mastersOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItem 
                    onClick={() => {
                      handleSectionChange('role');
                      handleRoleClick();
                    }}
                    sx={{ 
                      pl: 4,
                      py: 1.5,
                      bgcolor: section === 'role' ? '#283593' : 'transparent',
                      '&:hover': {
                        cursor: 'pointer',
                        bgcolor: section === 'role' ? '#283593' : 'rgba(255,255,255,0.1)'
                      }
                    }}
                  >
                    <ListItemIcon>
                      <WorkIcon sx={{ color: '#fff' }} />
                    </ListItemIcon>
                    <ListItemText primary="Role" sx={{ '& .MuiListItemText-primary': { fontWeight: 'bold' } }} />
                  </ListItem>
                  <ListItem 
                    onClick={() => {
                      handleSectionChange('class');
                      handleClassClick();
                    }}
                    sx={{ 
                      pl: 4,
                      py: 1.5,
                      bgcolor: section === 'class' ? '#283593' : 'transparent',
                      '&:hover': {
                        cursor: 'pointer',
                        bgcolor: section === 'class' ? '#283593' : 'rgba(255,255,255,0.1)'
                      }
                    }}
                  >
                    <ListItemIcon>
                      <ClassIcon sx={{ color: '#fff' }} />
                    </ListItemIcon>
                    <ListItemText primary="Class" sx={{ '& .MuiListItemText-primary': { fontWeight: 'bold' } }} />
                  </ListItem>
                </List>
              </Collapse>
            </>
          )}
        </List>
      </Box>

      {/* Main Content */}
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
            {!isFaculty && (
              <MenuItem onClick={handleCloseMenu}>Commission Structure</MenuItem>
            )}
            <MenuItem onClick={handleCloseMenu}>Change Password</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>

        {section === 'students' && (
          <>
            <Box sx={{ mb: 3, maxWidth: 300 }}>
              <Card sx={{ bgcolor: '#3949ab', color: '#fff' }}>
                <CardContent>
                  <Typography variant="h5" fontWeight="bold">
                    {students.length}
                  </Typography>
                  <Typography variant="subtitle1">Total Students</Typography>
                </CardContent>
              </Card>
            </Box>
            <Paper sx={{ p: 3, mb: 4, maxWidth: 600 }} elevation={2}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {editModeStudent ? 'Edit Student' : 'Add Student'}
              </Typography>
              {studentError && (
                <Typography color="error" sx={{ mb: 2 }}>{studentError}</Typography>
              )}
              <form onSubmit={handleSubmitStudent} style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <TextField
                  label="First Name"
                  name="firstName"
                  value={studentForm.firstName}
                  onChange={handleChangeStudent}
                  required
                  sx={{ flex: 1, minWidth: 180 }}
                />
                <TextField
                  label="Last Name"
                  name="lastName"
                  value={studentForm.lastName}
                  onChange={handleChangeStudent}
                  required
                  sx={{ flex: 1, minWidth: 180 }}
                />
                <TextField
                  label="Mobile Number"
                  name="mobileNumber"
                  value={studentForm.mobileNumber}
                  onChange={handleChangeStudent}
                  required
                  sx={{ flex: 1, minWidth: 180 }}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                  <Button type="submit" variant="contained" color="primary">
                    {editModeStudent ? 'Save' : 'Add'}
                  </Button>
                  {editModeStudent && (
                    <Button onClick={handleCancelStudent} variant="outlined" color="secondary">
                      Cancel
                    </Button>
                  )}
                </Box>
              </form>
            </Paper>
            <TableContainer component={Paper} elevation={2} sx={{ maxWidth: 900 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>First Name</TableCell>
                    <TableCell>Last Name</TableCell>
                    <TableCell>Mobile Number</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id ?? ''}>
                      <TableCell>{student.firstName}</TableCell>
                      <TableCell>{student.lastName}</TableCell>
                      <TableCell>{student.mobileNumber}</TableCell>
                      <TableCell align="right">
                        <IconButton color="primary" onClick={() => handleEditStudent(student)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDeleteStudent(student.id ?? '')}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
        {/* Show other sections only for non-faculty users */}
        {!isFaculty && (
          <>
            {section === 'faculty' && <Faculty />}
            {section === 'role' && <Role />}
            {section === 'class' && <Class />}
          </>
        )}
      </Box>
    </Box>
  );
}; 