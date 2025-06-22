import { useState } from 'react';
import { Box, Typography, AppBar, Toolbar, Avatar, Button, Container, Menu, MenuItem, Divider } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EventNoteIcon from '@mui/icons-material/EventNote';
import PersonIcon from '@mui/icons-material/Person';
import CampaignIcon from '@mui/icons-material/Campaign';

// Styled components
const StyledAppBar = styled(AppBar)({
  backgroundColor: '#111422',
  boxShadow: 'none',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
});

const StyledButton = styled(Button)({
  color: '#fff',
  textTransform: 'none',
  fontSize: '14px',
  '&:hover': {
    backgroundColor: 'transparent',
    opacity: 0.8
  }
});

const Logo = styled('div')({
  width: '24px',
  height: '24px',
  backgroundColor: '#fff',
  clipPath: 'polygon(0 0, 100% 0, 85% 50%, 100% 100%, 0 100%, 15% 50%)'
});

const CourseBox = styled(Box)({
  backgroundColor: '#1A1F37',
  color: '#fff',
  borderRadius: '12px',
  marginBottom: '24px',
  padding: '32px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: '32px',
  '&:hover': {
    backgroundColor: '#242B51'
  }
});

const ViewButton = styled(Button)({
  backgroundColor: '#242B51',
  color: '#fff',
  textTransform: 'none',
  padding: '8px 16px',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: 500,
  '&:hover': {
    backgroundColor: '#2f3660'
  }
});

export const NewStudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  if (!user || user.role !== 'student') {
    return <Typography>Access Denied</Typography>;
  }

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
    navigate('/login');
  };

  const handleProfile = () => {
    handleClose();
    // Add profile navigation here
  };

  const handleChangePassword = () => {
    handleClose();
    // Add change password navigation here
  };

  const upcomingClasses = [
    {
      title: 'Introduction to Psychology',
      schedule: 'Mon, Wed, Fri 10:00 AM - 10:50 AM | Dr. Eleanor Bennett',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&h=450'
    },
    {
      title: 'Calculus I',
      schedule: 'Tue, Thu 11:00 AM - 12:15 PM | Prof. Ethan Carter',
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&h=450'
    }
  ];

  const assignments = [
    {
      title: 'Psychology Paper',
      details: 'Introduction to Psychology | Due: Nov 12, 2024 | Status: In Progress',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCL3mhbqMNiVPbFlv9LFpO7ZhX1e0KV72y7kCqzQkCeoJhTceCuvZ7VIw_sbz8_Gw-RSyqlENim0E4C0YO8Y2fcZJ9VZ3YgyyB3rH4qB_tmoYxWKmlxiBbyoY7xiU_awwYevgidUtD07EB43F11LRpR7bRlMFeQa931flhRaF4iD_pVoO4Ftn794ikeaBffXZ_lARtvoLyJiTpcykzj7OGbzQHSTxExq2Z5c69rUQ9ENI0lYSw0RdZhAF4nHOLne1DiiUgK7PFoEQ'
    },
    {
      title: 'Calculus Problem Set',
      details: 'Calculus I | Due: Nov 14, 2024 | Status: Not Started',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZYg-k9ahiOpjwSIxQKHUru0wooD_Q3p6T0vAzKupnhuUHhwVmwQrSCurqFTLA6QKz3hBKRzDXCXFjd_420oWDdZCtEww_emGiD28EFDHYTbFXbx2h2nGIs4Ft5FLfDAtxqSbGlkUyQePCKDMdxe0sdr4OIhQeewS78GvE_Ds1dV_QlLIonQ7Z2Z7NDGAxmkxPav4okN5iz9fLjvmQqn84Nc0KyPubNRO_WDqWERGJ94Y5aagerWJ0rl7UHx0nHgF4cRpbzCIfHw'
    },
    {
      title: 'English Essay',
      details: 'English Composition | Due: Nov 17, 2024 | Status: Completed',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBV1X7WtCgTi_zEhhMmR-QI7P8fOiaAUqK2p6rG4TnFtDjl-XhzscM3ICcz-QP4AewXSdSTtAJEIs3nXMcWWly5lLbJwXDUnFUSIRl_eyLU8Dru_xzohsrFG7ffckfhWqqroasP4shFm4kbT17iItzk3EjPE1lqJ3AeNWw2_XiWRvoawrZtqh7EVlMDAQHef6j--YUzOofT1KFP-ZMw0VVtkoaybhhEPLz0atuXH3htROa1Rlrka3R4GAomjtuQLNHBwY0S56lXpg'
    }
  ];

  const grades = [
    {
      title: 'Midterm Exam',
      details: 'Introduction to Psychology | Grade: 85% | Date: Nov 2, 2024',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCHpS4LCC5FnlLMEaKHXTJMequwG5Cn0p6jakbziBSCfn2erIrxLjp1hk2M2FMNojtuuYxO7QdoN-uC_2EV1V_OnNZlqpUq2ZyWJqPD6rIEo0tmnFDY93NK9UDPZi1C6eo7N_JlouYqhX1n6ngBLazvpf6kPTxRiGzuD2hbz8QZe2GhbaIxgAoc9-_xWWn28lJtNT5tw7pxJm12mCZ-rTg9Q21dZ0VXjAP93PE5v8zvTG7GVJSd3IHXFMXdZpnsmZObmWeurPDgUg'
    },
    {
      title: 'Quiz 1',
      details: 'Calculus I | Grade: 92% | Date: Oct 28, 2024',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBcHKWtfaAw7oAfeL-GAsfnbyQWfpcVU2S-vLu9KN8TqY86qByM52dgje5MionJho7klhTlsDc4mxx9LsaWhmylPD4KdFb6km0z99fuds38uCCyhLmcVXMOFoNoaux8ORMLn1VS6vhcf2d5HMS9BwA5dm16xIFie-VEVpSV31Vw_MUaz0NfTnSrVOvOLWvF0isqETNn7RGScbiioYftmWg8bWZtDonWvFa4tVr__WTi1sbKn71otE0TaoH3BcEZFWjScW4HXcCc4w'
    },
    {
      title: 'Essay 1',
      details: 'English Composition | Grade: 78% | Date: Oct 20, 2024',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDfCT0UaYYa-cAWyl5YU_zdmToV19vCjmO6mA7tiLEZnNT9NQn3YSiyEDDbfMPn4JPOWj9A9kCQKlVuJ3nyd3cHJHiJcLbOca0L-6y2ISROdX5ZexJ7cRHzx4k_n_isi77m725z4socwOEsdXr4GGqDyWU7cLTwROTDvJMhkWBga757n1eFiPkgy2GpGXa-QAvcG959wRSvWo8N3SK32Lx1Vk7T071WcICb5oAgPtLfJHO2TmDRvhhVLG7hqKaqeR7BoQaDYNpiOw'
    }
  ];

  const announcements = [
    {
      title: 'Campus-wide Career Fair',
      date: 'Nov 7, 2024'
    },
    {
      title: 'Library Extended Hours',
      date: 'Nov 4, 2024'
    },
    {
      title: 'Student Government Elections',
      date: 'Nov 2, 2024'
    }
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: '#111422',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <StyledAppBar position="static">
        <Toolbar sx={{ px: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Logo />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Student CRM
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', gap: 4 }}>
            <StyledButton>Dashboard</StyledButton>
            <StyledButton>Courses</StyledButton>
            <StyledButton>Assignments</StyledButton>
            <StyledButton>Grades</StyledButton>
            <StyledButton>Announcements</StyledButton>
          </Box>
          <Box 
            onClick={handleMenu}
            sx={{ 
              cursor: 'pointer',
              '&:hover': { opacity: 0.8 }
            }}
          >
            <Avatar 
              sx={{ 
                width: 40, 
                height: 40,
                bgcolor: '#242B51'
              }}
            >
              {user.name?.charAt(0).toUpperCase()}
            </Avatar>
          </Box>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 200,
                backgroundColor: '#1A1F37',
                color: '#fff',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                '& .MuiMenuItem-root': {
                  fontSize: '14px',
                  padding: '10px 20px',
                  '&:hover': {
                    backgroundColor: '#242B51'
                  }
                }
              }
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {user.name}
              </Typography>
            </MenuItem>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
            <MenuItem onClick={handleProfile}>Profile</MenuItem>
            <MenuItem onClick={handleChangePassword}>Change Password</MenuItem>
            <MenuItem onClick={handleLogout} sx={{ color: '#ef5350' }}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </StyledAppBar>

      {/* Main Content */}
      <Box sx={{ 
        flex: 1, 
        width: '100%', 
        maxWidth: '1200px', 
        mx: 'auto', 
        px: 4, 
        py: 6 
      }}>
        {/* Dashboard Header */}
        <Typography variant="h3" sx={{ 
          fontSize: '48px',
          fontWeight: 700,
          mb: 1
        }}>
          Dashboard
        </Typography>
        <Typography sx={{ 
          color: 'rgba(255, 255, 255, 0.7)',
          mb: 6,
          fontSize: '16px'
        }}>
          Welcome back, Olivia! Here's an overview of your academic progress and upcoming tasks.
        </Typography>

        {/* Upcoming Classes Section */}
        <Typography variant="h5" sx={{ 
          fontSize: '24px',
          fontWeight: 600,
          mb: 3
        }}>
          Upcoming Classes
        </Typography>

        {upcomingClasses.map((course, index) => (
          <CourseBox key={index}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 600, 
                mb: 1,
                fontSize: '20px'
              }}>
                {course.title}
              </Typography>
              <Typography sx={{ 
                color: 'rgba(255, 255, 255, 0.7)',
                mb: 3,
                fontSize: '14px'
              }}>
                {course.schedule}
              </Typography>
              <ViewButton>
                View Course
              </ViewButton>
            </Box>
            <Box 
              component="img"
              src={course.image}
              sx={{
                width: '400px',
                height: '225px',
                borderRadius: '12px',
                objectFit: 'cover'
              }}
            />
          </CourseBox>
        ))}

        {/* Assignments */}
        <Typography className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
          Assignments Due Soon
        </Typography>
        {assignments.map((assignment, index) => (
          <CourseBox key={index}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 600, 
                mb: 1,
                fontSize: '20px'
              }}>
                {assignment.title}
              </Typography>
              <Typography sx={{ 
                color: 'rgba(255, 255, 255, 0.7)',
                mb: 3,
                fontSize: '14px'
              }}>
                {assignment.details}
              </Typography>
              <ViewButton>
                View Assignment
              </ViewButton>
            </Box>
            <Box 
              component="img"
              src={assignment.image}
              sx={{
                width: '400px',
                height: '225px',
                borderRadius: '12px',
                objectFit: 'cover'
              }}
            />
          </CourseBox>
        ))}

        {/* Grades */}
        <Typography className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
          Recent Grades
        </Typography>
        {grades.map((grade, index) => (
          <CourseBox key={index}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 600, 
                mb: 1,
                fontSize: '20px'
              }}>
                {grade.title}
              </Typography>
              <Typography sx={{ 
                color: 'rgba(255, 255, 255, 0.7)',
                mb: 3,
                fontSize: '14px'
              }}>
                {grade.details}
              </Typography>
              <ViewButton>
                View Grades
              </ViewButton>
            </Box>
            <Box 
              component="img"
              src={grade.image}
              sx={{
                width: '400px',
                height: '225px',
                borderRadius: '12px',
                objectFit: 'cover'
              }}
            />
          </CourseBox>
        ))}

        {/* Announcements */}
        <Typography className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
          Announcements
        </Typography>
        {announcements.map((announcement, index) => (
          <CourseBox key={index}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 600, 
                mb: 1,
                fontSize: '20px'
              }}>
                {announcement.title}
              </Typography>
              <Typography sx={{ 
                color: 'rgba(255, 255, 255, 0.7)',
                mb: 3,
                fontSize: '14px'
              }}>
                {announcement.date}
              </Typography>
              <ViewButton>
                View Announcement
              </ViewButton>
            </Box>
            <Box 
              component="img"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNCwXTrbPTo4I-uNVG9qRwrWjiR1b0i7EsXyKeVNC5K48Um049SpMjsAmepdket25JrTFH9_fk4M1dEtgdi7T5aQ4W9hvMzJWswhSOItL7rktIuS52Drw6zN6k--NQb9IlfAW7lZpxUjUs26hnZ5eHtDlh1LwLcdbR6Dya0m7Ie3TWuC_O5BR3b9JyP__2-Ij8fIEDlGAvrXH7O97uJP3zrcKns_lRP9YVlA3_fcY_OrCCEQPRQLY-aC5_fswkoMUNIeIavse4xw"
            />
          </CourseBox>
        ))}
      </Box>
    </Box>
  );
}; 