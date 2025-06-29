import { Box, Card, CardContent, Typography, Grid, Avatar, Divider } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { colors } from '../utils/theme';
import EmailIcon from '@mui/icons-material/Email';
import SchoolIcon from '@mui/icons-material/School';
import ClassIcon from '@mui/icons-material/Class';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import { styled } from '@mui/material/styles';

// Styled components to match dashboard theme
const StyledCard = styled(Card)({
  backgroundColor: '#1A1F37',
  color: '#fff',
  borderRadius: '12px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
});

// Dummy data for student profile
const studentData = {
  enrollmentDate: '2023-09-01',
  class: 'Class X-A',
  address: '123 Student Lane, Education City, ST 12345',
  phone: '+1 (555) 123-4567',
  emergencyContact: '+1 (555) 987-6543',
  bloodGroup: 'A+',
  dateOfBirth: '2005-05-15',
  fatherName: 'John Doe',
  motherName: 'Jane Doe',
  achievements: [
    'First Prize in Science Fair 2023',
    'School Basketball Team Captain',
    'Perfect Attendance Award'
  ]
};

const InfoRow = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
    <Box sx={{ 
      mr: 2, 
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      opacity: 0.7
    }}>
      {icon}
    </Box>
    <Box>
      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', display: 'block' }}>
        {label}
      </Typography>
      <Typography variant="body1" sx={{ color: '#fff' }}>
        {value}
      </Typography>
    </Box>
  </Box>
);

export const Profile = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <Typography>Access Denied</Typography>;
  }

  const getDisplayInitial = () => {
    return user.firstName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'S';
  };

  return (
    <Box sx={{ 
      minHeight: 'calc(100vh - 64px)',
      backgroundColor: '#111422',
      p: 4 
    }}>
      <Grid container spacing={3}>
        {/* Profile Header Card */}
        <Grid item xs={12}>
          <StyledCard>
            <CardContent sx={{ 
              display: 'flex', 
              alignItems: 'center',
              p: 4
            }}>
              <Avatar 
                sx={{ 
                  width: 100, 
                  height: 100, 
                  bgcolor: '#242B51',
                  fontSize: '2.5rem'
                }}
              >
                {getDisplayInitial()}
              </Avatar>
              <Box sx={{ ml: 3 }}>
                <Typography variant="h4" sx={{ color: '#fff', mb: 1, fontWeight: 600 }}>
                  {`${user.firstName || ''} ${user.lastName || ''}`}
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Student ID: STU{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}
                </Typography>
              </Box>
            </CardContent>
          </StyledCard>
        </Grid>

        {/* Basic Information */}
        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, color: '#fff', fontWeight: 600 }}>
                Basic Information
              </Typography>
              
              <InfoRow 
                icon={<EmailIcon />}
                label="Email Address"
                value={user.email || 'N/A'}
              />
              
              <InfoRow 
                icon={<SchoolIcon />}
                label="Class"
                value={studentData.class}
              />
              
              <InfoRow 
                icon={<CalendarTodayIcon />}
                label="Date of Birth"
                value={studentData.dateOfBirth}
              />
              
              <InfoRow 
                icon={<LocationOnIcon />}
                label="Address"
                value={studentData.address}
              />
              
              <InfoRow 
                icon={<PhoneIcon />}
                label="Phone Number"
                value={studentData.phone}
              />
            </CardContent>
          </StyledCard>
        </Grid>

        {/* Additional Information */}
        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, color: '#fff', fontWeight: 600 }}>
                Additional Information
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.5)', mb: 1 }}>
                  Parents Information
                </Typography>
                <Typography variant="body1" sx={{ color: '#fff', mb: 1 }}>
                  Father's Name: {studentData.fatherName}
                </Typography>
                <Typography variant="body1" sx={{ color: '#fff' }}>
                  Mother's Name: {studentData.motherName}
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.5)', mb: 1 }}>
                  Emergency Contact
                </Typography>
                <Typography variant="body1" sx={{ color: '#fff' }}>
                  {studentData.emergencyContact}
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
              
              <Box>
                <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.5)', mb: 1 }}>
                  Achievements
                </Typography>
                {studentData.achievements.map((achievement, index) => (
                  <Typography key={index} variant="body1" sx={{ color: '#fff', mb: 0.5 }}>
                    • {achievement}
                  </Typography>
                ))}
              </Box>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
    </Box>
  );
}; 