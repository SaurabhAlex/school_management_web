import { Box } from '@mui/material';
import { ManageStudents } from '../components/ManageStudents';

export const FacultyDashboard = () => {
  return (
    <Box>
      <ManageStudents title="Manage Students" showEmailField={true} />
    </Box>
  );
}; 