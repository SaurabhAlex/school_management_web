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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useClass } from '../hooks/useClass';
import { useFaculty } from '../hooks/useFaculty';
import type { Class as ClassType } from '../services/class';

interface FormData {
  name: string;
  section: string;
  academicYear: string;
  classTeacher: string;
  capacity: string;
  description: string;
}

export const Class = () => {
  const { classes, isLoading, addClass, editClass, deleteClass } = useClass();
  const { faculty } = useFaculty();
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<FormData>({
    name: '',
    section: '',
    academicYear: '',
    classTeacher: '',
    capacity: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [editingClassId, setEditingClassId] = useState('');

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        // Allow numbers 1-12 or single uppercase letters
        const trimmedValue = value.trim();
        // First check if it's a number between 1-12
        const numValue = parseInt(trimmedValue);
        if (!isNaN(numValue) && numValue >= 1 && numValue <= 12) {
          return '';
        }
        // If not a number, check if it's a single uppercase letter
        if (/^[A-Z]$/.test(trimmedValue)) {
          return '';
        }
        return 'Name should be a number (1-12) or a single uppercase letter';
      case 'section':
        if (!value.trim()) return 'Section is required';
        // Allow single uppercase letters only
        if (!/^[A-Z]$/.test(value.trim())) {
          return 'Section should be a single uppercase letter (A-Z)';
        }
        return '';
      case 'academicYear':
        return value.trim() ? '' : 'Academic Year is required';
      case 'classTeacher':
        return value ? '' : 'Class Teacher is required';
      case 'capacity':
        const capacityNum = parseInt(value);
        return !isNaN(capacityNum) && capacityNum > 0 ? '' : 'Please enter a valid capacity';
      default:
        return '';
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    let isValid = true;

    Object.keys(form).forEach((key) => {
      if (key !== 'description') { // Description is optional
        const error = validateField(key, form[key as keyof FormData]);
        if (error) {
          errors[key] = error;
          isValid = false;
        }
      }
    });

    setFieldErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    try {
      const data = {
        name: form.name.trim(),
        section: form.section.trim(),
        academicYear: form.academicYear.trim(),
        classTeacher: form.classTeacher,
        capacity: parseInt(form.capacity),
        description: form.description.trim(),
      };

      if (editMode && editingClassId) {
        await editClass({ 
          id: editingClassId,
          ...data
        });
      } else {
        await addClass(data);
      }
      
      resetForm();
    } catch (err: any) {
      console.error('Error saving class:', err);
      setError(
        err?.response?.data?.message || 
        err?.response?.data?.error || 
        err?.message || 
        'Failed to save class.'
      );
    }
  };

  const handleEdit = (classItem: ClassType) => {
    setForm({
      name: classItem.name.replace(/^0/, ''), // Remove leading zero when editing
      section: classItem.section,
      academicYear: classItem.academicYear,
      classTeacher: classItem.classTeacher._id,
      capacity: classItem.capacity.toString(),
      description: classItem.description || '',
    });
    setEditingClassId(classItem._id);
    setEditMode(true);
    setError('');
  };

  const resetForm = () => {
    setForm({
      name: '',
      section: '',
      academicYear: '',
      classTeacher: '',
      capacity: '',
      description: '',
    });
    setEditMode(false);
    setEditingClassId('');
    setError('');
    setFieldErrors({});
  };

  const handleDelete = async (classItem: ClassType) => {
    if (window.confirm(`Are you sure you want to delete class ${classItem.name.replace(/^0/, '')} ${classItem.section}?`)) {
      try {
        await deleteClass(classItem._id);
        setError(''); // Clear any existing errors on success
      } catch (err: any) {
        console.error('Error deleting class:', err);
        setError(
          err?.response?.data?.message || 
          err?.response?.data?.error || 
          err?.message || 
          'Failed to delete class.'
        );
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setFieldErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleUppercaseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const uppercaseValue = value.toUpperCase();
    setForm(prev => ({ ...prev, [name]: uppercaseValue }));
    const error = validateField(name, uppercaseValue);
    setFieldErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setFieldErrors(prev => ({ ...prev, [name]: error }));
  };

  return (
    <Box>
      <Box sx={{ mb: 3, maxWidth: 300 }}>
        <Card sx={{ bgcolor: '#3949ab', color: '#fff' }}>
          <CardContent>
            <Typography variant="h5" fontWeight="bold">
              {classes.length}
            </Typography>
            <Typography variant="subtitle1">Total Classes</Typography>
          </CardContent>
        </Card>
      </Box>
      <Paper sx={{ p: 3, mb: 4 }} elevation={2}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {editMode ? 'Edit Class' : 'Add Class'}
        </Typography>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>
        )}
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ flex: '1 1 calc(33% - 8px)', minWidth: 200 }}>
              <TextField
                label="Name"
                name="name"
                value={form.name}
                onChange={handleUppercaseChange}
                required
                fullWidth
                error={!!fieldErrors.name}
                helperText={fieldErrors.name || 'Enter a number (1-12) or a letter (A-Z)'}
                inputProps={{ maxLength: 2 }}
              />
            </Box>
            <Box sx={{ flex: '1 1 calc(33% - 8px)', minWidth: 200 }}>
              <TextField
                label="Section"
                name="section"
                value={form.section}
                onChange={handleUppercaseChange}
                required
                fullWidth
                error={!!fieldErrors.section}
                helperText={fieldErrors.section || 'Enter a single letter (A-Z)'}
                inputProps={{ maxLength: 1 }}
              />
            </Box>
            <Box sx={{ flex: '1 1 calc(33% - 8px)', minWidth: 200 }}>
              <TextField
                label="Academic Year"
                name="academicYear"
                value={form.academicYear}
                onChange={handleChange}
                required
                fullWidth
                error={!!fieldErrors.academicYear}
                helperText={fieldErrors.academicYear}
              />
            </Box>
            <Box sx={{ flex: '1 1 calc(33% - 8px)', minWidth: 200 }}>
              <FormControl fullWidth required error={!!fieldErrors.classTeacher}>
                <InputLabel>Class Teacher</InputLabel>
                <Select
                  name="classTeacher"
                  value={form.classTeacher}
                  onChange={handleSelectChange}
                  label="Class Teacher"
                >
                  {faculty.map((teacher) => (
                    <MenuItem key={teacher._id} value={teacher._id}>
                      {`${teacher.firstName} ${teacher.lastName}`}
                    </MenuItem>
                  ))}
                </Select>
                {fieldErrors.classTeacher && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                    {fieldErrors.classTeacher}
                  </Typography>
                )}
              </FormControl>
            </Box>
            <Box sx={{ flex: '1 1 calc(33% - 8px)', minWidth: 200 }}>
              <TextField
                label="Capacity"
                name="capacity"
                type="number"
                value={form.capacity}
                onChange={handleChange}
                required
                fullWidth
                error={!!fieldErrors.capacity}
                helperText={fieldErrors.capacity}
              />
            </Box>
            <Box sx={{ flex: '1 1 calc(33% - 8px)', minWidth: 200 }}>
              <TextField
                label="Description"
                name="description"
                value={form.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={2}
              />
            </Box>
            <Box sx={{ width: '100%', mt: 2 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button type="submit" variant="contained" color="primary">
                  {editMode ? 'Save' : 'Add'}
                </Button>
                {editMode && (
                  <Button onClick={resetForm} variant="outlined" color="secondary">
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
              <TableCell>Section</TableCell>
              <TableCell>Academic Year</TableCell>
              <TableCell>Class Teacher</TableCell>
              <TableCell>Capacity</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {classes.map((classItem) => (
              <TableRow key={classItem._id}>
                <TableCell>{classItem.name.replace(/^0/, '')}</TableCell>
                <TableCell>{classItem.section}</TableCell>
                <TableCell>{classItem.academicYear}</TableCell>
                <TableCell>{`${classItem.classTeacher.firstName} ${classItem.classTeacher.lastName}`}</TableCell>
                <TableCell>{classItem.capacity}</TableCell>
                <TableCell>{classItem.description}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => handleEdit(classItem)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(classItem)}>
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