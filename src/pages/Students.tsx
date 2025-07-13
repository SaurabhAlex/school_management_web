import { Box } from '@mui/material';
import { ManageStudents } from '../components/ManageStudents';

export const Students = () => {
  return (
    <Box>
      <ManageStudents title="Students" showEmailField={true} />
    </Box>
  );
}; 