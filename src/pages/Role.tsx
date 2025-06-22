import { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useRole } from '../hooks/useRole';
import type { Role as RoleType, CreateRoleData, UpdateRoleData } from '../services/role';

export const Role = () => {
  const { roles, isLoading, addRole, editRole, deleteRole } = useRole();
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleType | null>(null);
  const [form, setForm] = useState<CreateRoleData>({
    name: '',
    description: ''
  });
  const [error, setError] = useState('');
  
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleOpenDialog = (role?: RoleType) => {
    if (role) {
      setEditingRole(role);
      setForm({
        name: role.name,
        description: role.description
        });
      } else {
      setEditingRole(null);
      setForm({
        name: '',
        description: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingRole(null);
    setForm({
      name: '',
      description: ''
    });
    setError('');
  };

  const handleSubmit = async () => {
    try {
      if (editingRole?._id) {
        await editRole({
          id: editingRole._id,
          name: form.name,
          description: form.description
        });
      } else {
        await addRole(form);
      }
      handleCloseDialog();
    } catch (err: any) {
      setError(err?.message || 'Failed to save role');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
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

  const filteredRoles = roles.filter(role => 
    role.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 500 }}>All Roles</Typography>
        <Button 
          variant="contained" 
          onClick={() => handleOpenDialog()}
          sx={{ 
            bgcolor: '#1976d2',
            textTransform: 'none',
            '&:hover': {
              bgcolor: '#1565c0'
            }
          }}
        >
          Add Role
        </Button>
      </Box>

      <Box sx={{ mb: 3 }}>
              <TextField
          placeholder="Search by Role"
          value={searchQuery}
          onChange={handleSearch}
          size="small"
          sx={{ 
            minWidth: 300,
            bgcolor: 'white',
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#e0e0e0',
              },
              '&:hover fieldset': {
                borderColor: '#1976d2',
              },
            },
          }}
              />
            </Box>

      <TableContainer component={Paper} elevation={0}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#1a237e' }}>
              <TableCell sx={{ color: 'white', fontWeight: 500 }}>S.N.</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 500 }}>Roles</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 500 }}>Description</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 500 }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRoles.map((role, index) => (
              <TableRow 
                key={role._id}
                sx={{ 
                  '&:nth-of-type(odd)': { bgcolor: '#f5f5f5' },
                  '&:hover': { bgcolor: '#f5f5f5' }
                }}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>{role.name}</TableCell>
                <TableCell>{role.description}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleOpenDialog(role)}
                      sx={{ 
                        bgcolor: '#1a237e',
                        textTransform: 'none',
                        '&:hover': {
                          bgcolor: '#0d47a1'
                        }
                      }}
                    >
                      Update
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleDelete(role._id)}
                      sx={{ 
                        bgcolor: '#d32f2f',
                        textTransform: 'none',
                        '&:hover': {
                          bgcolor: '#b71c1c'
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ borderBottom: 1, borderColor: 'divider', pb: 2 }}>
          {editingRole ? 'Edit Role' : 'Add New Role'}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>
          )}
          <Box sx={{ mt: 1 }}>
            <TextField
              name="name"
              label="Role Name"
              value={form.name}
              onChange={handleInputChange}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <TextField
              name="description"
              label="Description"
              value={form.description}
              onChange={handleInputChange}
              fullWidth
              required
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button 
            onClick={handleCloseDialog} 
            sx={{ 
              color: 'text.secondary',
              textTransform: 'none'
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={!form.name || !form.description}
            sx={{ 
              bgcolor: '#1a237e',
              textTransform: 'none',
              '&:hover': {
                bgcolor: '#0d47a1'
              }
            }}
          >
            {editingRole ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 