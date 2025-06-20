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

export const Students = () => {
  const { students, isLoading, addStudent, editStudent, deleteStudent } = useStudents();
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ id: '', name: '', email: '', age: '' });
  const [error, setError] = useState('');

  const handleOpenAdd = () => {
    setForm({ id: '', name: '', email: '', age: '' });
    setEditMode(false);
    setOpenDialog(true);
    setError('');
  };

  const handleOpenEdit = (student: any) => {
    setForm({ id: student.id, name: student.name, email: student.email, age: String(student.age) });
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
      if (editMode) {
        await editStudent({ id: form.id, name: form.name, email: form.email, age: Number(form.age) });
      } else {
        await addStudent({ name: form.name, email: form.email, age: Number(form.age) });
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
          <Grid item xs={12} sm={6} md={4} key={student.id} component="div">
            <Card sx={{ width: '100%', height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {student.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Email: {student.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Age: {student.age}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton size="small" onClick={() => handleOpenEdit(student)}>
                  <EditIcon />
                </IconButton>
                <IconButton size="small" onClick={() => handleDelete(student.id)}>
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>{editMode ? 'Edit Student' : 'Add Student'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            name="name"
            fullWidth
            value={form.name}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Email"
            name="email"
            fullWidth
            value={form.email}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Age"
            name="age"
            type="number"
            fullWidth
            value={form.age}
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