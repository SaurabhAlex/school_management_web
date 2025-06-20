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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Grid } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useFaculty } from '../hooks/useFaculty';
import { useRole } from '../hooks/useRole';
import type { Faculty as FacultyType, CreateFacultyData } from '../services/faculty';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  gender: string;
  department: string;
  role: string; // This will store the role ID
}

export const Faculty = () => {
  const { faculty, isLoading, addFaculty, editFaculty, deleteFaculty } = useFaculty();
  const { roles = [] } = useRole();
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    gender: '',
    department: '',
    role: '',
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [editingFacultyId, setEditingFacultyId] = useState('');

  const departments = ['Science', 'Mathematics', 'English', 'Social Studies', 'Physical Education', 'Arts', 'Other'];
  const genders = ['Male', 'Female', 'Other'];

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'firstName':
        return value.trim() ? '' : 'First Name is required';
      case 'lastName':
        return value.trim() ? '' : 'Last Name is required';
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Please enter a valid email address';
      case 'mobileNumber':
        return /^[6-9]\d{9}$/.test(value) ? '' : 'Please enter a valid 10-digit mobile number starting with 6-9';
      case 'gender':
        return value ? '' : 'Gender is required';
      case 'department':
        return value ? '' : 'Department is required';
      case 'role':
        return value ? '' : 'Role is required';
      default:
        return '';
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setFieldErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setFieldErrors(prev => ({ ...prev, [name]: error }));
  };

  const generateEmployeeId = () => {
    const prefix = 'EMP';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${timestamp}${random}`;
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    Object.keys(form).forEach(key => {
      if (key !== 'id' && key !== 'employeeId') {
        const value = form[key as keyof typeof form];
        const error = validateField(key, value || '');
        if (error) {
          errors[key] = error;
        }
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
      // Form data is already in the correct format with role ID
      const formData: CreateFacultyData = form;

      if (editMode) {
        if (!editingFacultyId) {
          throw new Error('Faculty ID is required for updates');
        }
        await editFaculty(editingFacultyId, formData);
      } else {
        await addFaculty(formData);
      }
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        mobileNumber: '',
        gender: '',
        department: '',
        role: '',
      });
      setEditMode(false);
      setEditingFacultyId('');
      setFieldErrors({});
    } catch (err: any) {
      console.error('Error saving faculty:', err);
      setError(
        err?.response?.data?.message || 
        err?.response?.data?.error || 
        err?.message || 
        'Failed to save faculty.'
      );
    }
  };

  const handleEdit = (facultyItem: FacultyType) => {
    setForm({
      firstName: facultyItem.firstName,
      lastName: facultyItem.lastName,
      email: facultyItem.email,
      mobileNumber: facultyItem.mobileNumber,
      gender: facultyItem.gender,
      department: facultyItem.department,
      role: facultyItem.role._id, // Store the role ID in the form
    });
    setEditingFacultyId(facultyItem._id); // Use _id instead of facultyId
    setEditMode(true);
    setError('');
    setFieldErrors({});
  };

  const handleCancel = () => {
    setForm({
      firstName: '',
      lastName: '',
      email: '',
      mobileNumber: '',
      gender: '',
      department: '',
      role: '',
    });
    setEditMode(false);
    setError('');
    setFieldErrors({});
  };

  const handleDelete = async (id: string) => {
    if (!id) {
      setError('Invalid faculty ID for deletion');
      return;
    }

    if (window.confirm('Are you sure you want to delete this faculty?')) {
      try {
        await deleteFaculty(id);
      } catch (err: any) {
        console.error('Error deleting faculty:', err);
        setError(
          err?.response?.data?.message || 
          err?.response?.data?.error || 
          err?.message || 
          'Failed to delete faculty.'
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
              {faculty.length}
            </Typography>
            <Typography variant="subtitle1">Total Faculty</Typography>
          </CardContent>
        </Card>
      </Box>
      <Paper sx={{ p: 3, mb: 4 }} elevation={2}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {editMode ? 'Edit Faculty' : 'Add Faculty'}
        </Typography>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>
        )}
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 200 }}>
              <TextField
                label="First Name"
                name="firstName"
                value={form.firstName}
                onChange={handleTextChange}
                required
                fullWidth
                error={!!fieldErrors.firstName}
                helperText={fieldErrors.firstName}
              />
            </Box>
            <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 200 }}>
              <TextField
                label="Last Name"
                name="lastName"
                value={form.lastName}
                onChange={handleTextChange}
                required
                fullWidth
                error={!!fieldErrors.lastName}
                helperText={fieldErrors.lastName}
              />
            </Box>
            <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 200 }}>
              <TextField
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleTextChange}
                required
                fullWidth
                error={!!fieldErrors.email}
                helperText={fieldErrors.email}
              />
            </Box>
            <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 200 }}>
              <TextField
                label="Mobile Number"
                name="mobileNumber"
                value={form.mobileNumber}
                onChange={handleTextChange}
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
            <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 200 }}>
              <FormControl fullWidth required error={!!fieldErrors.gender}>
                <InputLabel>Gender</InputLabel>
                <Select
                  name="gender"
                  value={form.gender}
                  onChange={handleSelectChange}
                  label="Gender"
                >
                  {genders.map((gender) => (
                    <MenuItem key={gender} value={gender}>{gender}</MenuItem>
                  ))}
                </Select>
                {fieldErrors.gender && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                    {fieldErrors.gender}
                  </Typography>
                )}
              </FormControl>
            </Box>
            <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 200 }}>
              <FormControl fullWidth required error={!!fieldErrors.department}>
                <InputLabel>Department</InputLabel>
                <Select
                  name="department"
                  value={form.department}
                  onChange={handleSelectChange}
                  label="Department"
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                  ))}
                </Select>
                {fieldErrors.department && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                    {fieldErrors.department}
                  </Typography>
                )}
              </FormControl>
            </Box>
            <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 200 }}>
              <FormControl fullWidth required error={!!fieldErrors.role}>
                <InputLabel>Role</InputLabel>
                <Select
                  name="role"
                  value={form.role}
                  onChange={handleSelectChange}
                  label="Role"
                >
                  {Array.isArray(roles) && roles.map((role) => (
                    <MenuItem key={role._id} value={role._id}>
                      {role.name}
                    </MenuItem>
                  ))}
                </Select>
                {fieldErrors.role && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                    {fieldErrors.role}
                  </Typography>
                )}
              </FormControl>
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
              <TableCell>Employee ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Mobile</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(faculty) && faculty.map((fac: FacultyType) => (
              <TableRow key={fac._id}>
                <TableCell>{fac.employeeId}</TableCell>
                <TableCell>{`${fac.firstName} ${fac.lastName}`}</TableCell>
                <TableCell>{fac.email}</TableCell>
                <TableCell>{fac.mobileNumber}</TableCell>
                <TableCell>{fac.department}</TableCell>
                <TableCell>{fac.role?.name || 'No Role Assigned'}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEdit(fac)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    color="error" 
                    onClick={() => handleDelete(fac._id)}
                  >
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

export default Faculty; 