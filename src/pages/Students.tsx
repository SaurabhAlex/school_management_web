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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useStudents } from '../hooks/useStudents';
import type { Student, CreateStudentData, UpdateStudentData } from '../services/students';

interface FormData {
  firstName: string;
  lastName: string;
  mobileNumber: string;
}

export const Students = () => {
  const { students, isLoading, addStudent, editStudent, deleteStudent } = useStudents();
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<FormData>({
    firstName: '',
    lastName: '',
    mobileNumber: '',
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [editingStudentId, setEditingStudentId] = useState('');

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'firstName':
        return value.trim() ? '' : 'First Name is required';
      case 'lastName':
        return value.trim() ? '' : 'Last Name is required';
      case 'mobileNumber':
        return /^[6-9]\d{9}$/.test(value) ? '' : 'Please enter a valid 10-digit mobile number starting with 6-9';
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setFieldErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    Object.keys(form).forEach(key => {
      const value = form[key as keyof typeof form];
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
    setError('');
    
    if (!validateForm()) {
      setError('Please fix all validation errors before submitting.');
      return;
    }

    try {
      if (editMode) {
        if (!editingStudentId) {
          throw new Error('Student ID is required for updates');
        }
        await editStudent({ ...form, id: editingStudentId });
      } else {
        await addStudent(form);
      }
      setForm({
        firstName: '',
        lastName: '',
        mobileNumber: '',
      });
      setEditMode(false);
      setEditingStudentId('');
      setFieldErrors({});
    } catch (err: any) {
      console.error('Error saving student:', err);
      setError(
        err?.response?.data?.message || 
        err?.response?.data?.error || 
        err?.message || 
        'Failed to save student.'
      );
    }
  };

  const handleEdit = (student: Student) => {
    setForm({
      firstName: student.firstName,
      lastName: student.lastName,
      mobileNumber: student.mobileNumber,
    });
    setEditingStudentId(student.id || '');
    setEditMode(true);
    setError('');
    setFieldErrors({});
  };

  const handleCancel = () => {
    setForm({
      firstName: '',
      lastName: '',
      mobileNumber: '',
    });
    setEditMode(false);
    setError('');
    setFieldErrors({});
  };

  const handleDelete = async (id: string) => {
    if (!id) {
      setError('Invalid student ID for deletion');
      return;
    }

    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await deleteStudent(id);
      } catch (err: any) {
        console.error('Error deleting student:', err);
        setError(
          err?.response?.data?.message || 
          err?.response?.data?.error || 
          err?.message || 
          'Failed to delete student.'
        );
      }
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Box>
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
          {editMode ? 'Edit Student' : 'Add Student'}
        </Typography>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>
        )}
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ flex: '1 1 calc(33% - 8px)', minWidth: 200 }}>
              <TextField
                label="First Name"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                required
                fullWidth
                error={!!fieldErrors.firstName}
                helperText={fieldErrors.firstName}
              />
            </Box>
            <Box sx={{ flex: '1 1 calc(33% - 8px)', minWidth: 200 }}>
              <TextField
                label="Last Name"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                required
                fullWidth
                error={!!fieldErrors.lastName}
                helperText={fieldErrors.lastName}
              />
            </Box>
            <Box sx={{ flex: '1 1 calc(33% - 8px)', minWidth: 200 }}>
              <TextField
                label="Mobile Number"
                name="mobileNumber"
                value={form.mobileNumber}
                onChange={handleChange}
                required
                fullWidth
                error={!!fieldErrors.mobileNumber}
                helperText={fieldErrors.mobileNumber}
                inputProps={{ 
                  maxLength: 10,
                  pattern: '[6-9][0-9]{9}'
                }}
              />
            </Box>
            <Box sx={{ width: '100%', mt: 2 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button type="submit" variant="contained" color="primary">
                  {editMode ? 'Save' : 'Add'}
                </Button>
                {editMode && (
                  <Button onClick={handleCancel} variant="outlined" color="secondary">
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
              <TableCell>Name</TableCell>
              <TableCell>Mobile Number</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(students) && students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{`${student.firstName} ${student.lastName}`}</TableCell>
                <TableCell>{student.mobileNumber}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEdit(student)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(student.id || '')}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}; 