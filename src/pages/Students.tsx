import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Grid,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useStudents } from '../hooks/useStudents';
import type { Student, CreateStudentData, UpdateStudentData } from '../services/students';

export const Students = () => {
  const { students, isLoading, addStudent, editStudent, deleteStudent } = useStudents();
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<Partial<Student>>({
    id: '',
    firstName: '',
    lastName: '',
    mobileNumber: ''
  });
  const [error, setError] = useState('');

  const handleOpenAdd = () => {
    setForm({
      id: '',
      firstName: '',
      lastName: '',
      mobileNumber: ''
    });
    setEditMode(false);
    setOpenDialog(true);
    setError('');
  };

  const handleOpenEdit = (student: Student) => {
    setForm({
      id: student.id,
      firstName: student.firstName,
      lastName: student.lastName,
      mobileNumber: student.mobileNumber
    });
    setEditMode(true);
    setOpenDialog(true);
    setError('');
  };

  const handleClose = () => {
    setOpenDialog(false);
    setError('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (editMode && form.id) {
        const updateData: UpdateStudentData = {
          id: form.id,
          firstName: form.firstName || '',
          lastName: form.lastName || '',
          mobileNumber: form.mobileNumber || ''
        };
        await editStudent(updateData);
      } else {
        const createData: CreateStudentData = {
          firstName: form.firstName || '',
          lastName: form.lastName || '',
          mobileNumber: form.mobileNumber || ''
        };
        await addStudent(createData);
      }
      setOpenDialog(false);
    } catch (err) {
      setError('Failed to save student.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await deleteStudent(id);
      } catch (err) {
        setError('Failed to delete student.');
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Students</Typography>
        <Button variant="contained" color="primary" onClick={handleOpenAdd}>
          Add Student
        </Button>
      </Box>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>
      )}
      <Grid container spacing={3}>
        {students.map((student) => (
          <Box key={student.id} sx={{ width: { xs: '100%', sm: '50%', md: '33.33%' }, p: 1.5 }}>
            <Card sx={{ width: '100%', height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {student.firstName} {student.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Mobile: {student.mobileNumber}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton size="small" onClick={() => handleOpenEdit(student)}>
                  <EditIcon />
                </IconButton>
                <IconButton size="small" onClick={() => handleDelete(student.id || '')}>
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Box>
        ))}
      </Grid>
      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>{editMode ? 'Edit Student' : 'Add Student'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="First Name"
            name="firstName"
            fullWidth
            value={form.firstName}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Last Name"
            name="lastName"
            fullWidth
            value={form.lastName}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Mobile Number"
            name="mobileNumber"
            fullWidth
            value={form.mobileNumber}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editMode ? 'Save' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 