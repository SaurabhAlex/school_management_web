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
import { useRole } from '../hooks/useRole';
import type { Role as RoleType } from '../services/role';

export const Role = () => {
  const { roles, isLoading, addRole, editRole, deleteRole } = useRole();
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<Omit<RoleType, '_id'>>({
    name: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [editingRoleId, setEditingRoleId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim() || !form.description.trim()) {
      setError('Name and description are required.');
      return;
    }

    try {
      if (editMode) {
        await editRole({ 
          id: editingRoleId, 
          name: form.name.trim(), 
          description: form.description.trim() 
        });
      } else {
        await addRole({
          name: form.name.trim(),
          description: form.description.trim()
        });
      }
      setForm({
        name: '',
        description: '',
      });
      setEditMode(false);
      setEditingRoleId('');
    } catch (err: any) {
      console.error('Error saving role:', err);
      setError(
        err?.response?.data?.message || 
        err?.response?.data?.error || 
        err?.message || 
        'Failed to save role.'
      );
    }
  };

  const handleEdit = (roleItem: RoleType) => {
    if (!roleItem._id) {
      console.error('Role item:', roleItem);
      setError('Role ID is missing from the role data');
      return;
    }
    setForm({
      name: roleItem.name,
      description: roleItem.description,
    });
    setEditingRoleId(roleItem._id);
    setEditMode(true);
    setError('');
  };

  const handleCancel = () => {
    setForm({
      name: '',
      description: '',
    });
    setEditMode(false);
    setEditingRoleId('');
    setError('');
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id) {
      console.error('Attempted to delete role with missing ID');
      setError('Cannot delete role: Role ID is missing');
      return;
    }

    if (window.confirm('Are you sure you want to delete this role?')) {
      try {
        await deleteRole(id);
      } catch (err: any) {
        console.error('Error deleting role:', err);
        setError(
          err?.response?.data?.message || 
          err?.response?.data?.error || 
          err?.message || 
          'Failed to delete role.'
        );
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Box>
      <Box sx={{ mb: 3, maxWidth: 300 }}>
        <Card sx={{ bgcolor: '#3949ab', color: '#fff' }}>
          <CardContent>
            <Typography variant="h5" fontWeight="bold">
              {roles.length}
            </Typography>
            <Typography variant="subtitle1">Total Roles</Typography>
          </CardContent>
        </Card>
      </Box>
      <Paper sx={{ p: 3, mb: 4 }} elevation={2}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {editMode ? 'Edit Role' : 'Add Role'}
        </Typography>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>
        )}
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 200 }}>
              <TextField
                label="Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                fullWidth
              />
            </Box>
            <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 200 }}>
              <TextField
                label="Description"
                name="description"
                value={form.description}
                onChange={handleChange}
                required
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
              <TableCell>Description</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role._id}>
                <TableCell>{role.name}</TableCell>
                <TableCell>{role.description}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => handleEdit(role)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(role._id)}>
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