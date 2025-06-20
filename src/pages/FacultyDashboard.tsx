import { useState } from 'react';
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
} from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useStudents } from '../hooks/useStudents';
import { useAuth } from '../hooks/useAuth';

export const FacultyDashboard = () => {
  const { students, addStudent, editStudent, deleteStudent } = useStudents();
  const { user, logout } = useAuth();

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

  const handleChangeStudent = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStudentForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditStudent = (student: any) => {
    setStudentForm({
      id: student.id,
      firstName: student.firstName,
      lastName: student.lastName,
      mobileNumber: student.mobileNumber
    });
    setEditModeStudent(true);
    setStudentError('');
  };

  const handleSubmitStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editModeStudent) {
        await editStudent(studentForm);
      } else {
        await addStudent({
          firstName: studentForm.firstName,
          lastName: studentForm.lastName,
          mobileNumber: studentForm.mobileNumber
        });
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
            sx={{ 
              bgcolor: '#283593',
              py: 1.5,
              '&:hover': {
                cursor: 'pointer',
                bgcolor: '#283593'
              }
            }}
          >
            <ListItemIcon>
              <GroupIcon sx={{ color: '#fff' }} />
            </ListItemIcon>
            <ListItemText primary="Students" sx={{ '& .MuiListItemText-primary': { fontWeight: 'bold' } }} />
          </ListItem>
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
            <MenuItem onClick={handleCloseMenu}>Change Password</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>

        {/* Main content */}
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
        <Paper sx={{ p: 3, mb: 4 }} elevation={2}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {editModeStudent ? 'Edit Student' : 'Add Student'}
          </Typography>
          {studentError && (
            <Typography color="error" sx={{ mb: 2 }}>{studentError}</Typography>
          )}
          <form onSubmit={handleSubmitStudent}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flex: '1 1 calc(33% - 8px)', minWidth: 200 }}>
                <TextField
                  label="First Name"
                  name="firstName"
                  value={studentForm.firstName}
                  onChange={handleChangeStudent}
                  required
                  fullWidth
                />
              </Box>
              <Box sx={{ flex: '1 1 calc(33% - 8px)', minWidth: 200 }}>
                <TextField
                  label="Last Name"
                  name="lastName"
                  value={studentForm.lastName}
                  onChange={handleChangeStudent}
                  required
                  fullWidth
                />
              </Box>
              <Box sx={{ flex: '1 1 calc(33% - 8px)', minWidth: 200 }}>
                <TextField
                  label="Mobile Number"
                  name="mobileNumber"
                  value={studentForm.mobileNumber}
                  onChange={handleChangeStudent}
                  required
                  fullWidth
                />
              </Box>
              <Box sx={{ width: '100%', mt: 2 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button type="submit" variant="contained" color="primary">
                    {editModeStudent ? 'Save' : 'Add'}
                  </Button>
                  {editModeStudent && (
                    <Button onClick={() => setEditModeStudent(false)} variant="outlined" color="secondary">
                      Cancel
                    </Button>
                  )}
                </Box>
              </Box>
            </Box>
          </form>
        </Paper>
        <TableContainer component={Paper} elevation={2}>
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
                <TableRow key={student.id}>
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
      </Box>
    </Box>
  );
}; 