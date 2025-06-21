import { useState } from 'react';


//faculty dashboard
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useStudents } from '../hooks/useStudents';
import { useAuth } from '../hooks/useAuth';
import type { Student } from '../services/students';

export const FacultyDashboard = () => {
  const { students, addStudent, editStudent, deleteStudent } = useStudents();
  const { user } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobileNumber: ''
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'firstName':
        return value.trim() ? '' : 'First Name is required here!';
      case 'lastName':
        return value.trim() ? '' : 'Last Name is required here!';
      case 'mobileNumber':
        return /^[6-9]\d{9}$/.test(value) ? '' : 'Please enter a valid 10-digit mobile number starting with 6-9';
      default:
        return '';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    const error = validateField(name, value);
    setFieldErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    Object.keys(formData).forEach(key => {
      const value = formData[key as keyof typeof formData];
      const error = validateField(key, value);
      if (error) {
        errors[key] = error;
      }
    });
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      if (editMode && selectedStudent) {
        await editStudent({
          id: selectedStudent.id,
          ...formData
        });
      } else {
        await addStudent(formData);
      }
      setFormData({
        firstName: '',
        lastName: '',
        mobileNumber: ''
      });
      setEditMode(false);
      setSelectedStudent(null);
      setFieldErrors({});
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = (student: Student) => {
    setEditMode(true);
    setSelectedStudent(student);
    setFormData({
      firstName: student.firstName,
      lastName: student.lastName,
      mobileNumber: student.mobileNumber
    });
    setFieldErrors({});
  };

  const handleDelete = async (id: string) => {
    if (!id) {
      console.error('Invalid student ID for deletion');
      return;
    }
    setOpenDialog(false);
    try {
      await deleteStudent(id);
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  const confirmDelete = (student: Student) => {
    setSelectedStudent(student);
    setOpenDialog(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Student Count Card */}
      <Box sx={{ mb: 3, maxWidth: 300 }}>
        <Card sx={{ bgcolor: '#3949ab', color: '#fff', borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h5" fontWeight="bold">
              {students?.length || 0}
            </Typography>
            <Typography variant="subtitle1">
              Total Students
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Add/Edit Student Form */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 1 }} elevation={1}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 500 }}>
          {editMode ? 'Edit Student' : 'Add Student'}
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              name="firstName"
              label="First Name"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              fullWidth
              size="small"
              error={!!fieldErrors.firstName}
              helperText={fieldErrors.firstName}
              sx={{ flex: 1 }}
            />
            <TextField
              name="lastName"
              label="Last Name"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              fullWidth
              size="small"
              error={!!fieldErrors.lastName}
              helperText={fieldErrors.lastName}
              sx={{ flex: 1 }}
            />
            <TextField
              name="mobileNumber"
              label="Mobile Number"
              value={formData.mobileNumber}
              onChange={handleInputChange}
              required
              fullWidth
              size="small"
              error={!!fieldErrors.mobileNumber}
              helperText={fieldErrors.mobileNumber}
              sx={{ flex: 1 }}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              sx={{
                bgcolor: '#1976d2',
                '&:hover': { bgcolor: '#1565c0' },
                textTransform: 'uppercase'
              }}
            >
              {editMode ? 'Save' : 'Add'}
            </Button>
            {editMode && (
              <Button
                onClick={() => {
                  setEditMode(false);
                  setSelectedStudent(null);
                  setFormData({ firstName: '', lastName: '', mobileNumber: '' });
                  setFieldErrors({});
                }}
                variant="outlined"
                color="error"
                sx={{ textTransform: 'uppercase' }}
              >
                Cancel
              </Button>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Students Table */}
      <Paper sx={{ borderRadius: 1 }} elevation={1}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 500 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 500 }}>Mobile Number</TableCell>
              <TableCell sx={{ fontWeight: 500 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students?.map((student: Student) => (
              <TableRow key={student.id}>
                <TableCell>{`${student.firstName} ${student.lastName}`}</TableCell>
                <TableCell>{student.mobileNumber}</TableCell>
                <TableCell>
                  <IconButton 
                    onClick={() => handleEdit(student)} 
                    size="small"
                    sx={{ color: '#1976d2' }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton 
                    onClick={() => confirmDelete(student)} 
                    size="small"
                    sx={{ color: '#d32f2f' }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this student?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button 
            onClick={() => selectedStudent && handleDelete(selectedStudent.id || '')} 
            color="error" 
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 