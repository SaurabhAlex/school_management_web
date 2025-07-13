import React, { useState, useEffect } from 'react';
import { useAttendance } from '../hooks/useAttendance';
import { useStudents } from '../hooks/useStudents';
import { LoadingSpinner } from './LoadingSpinner';
import type { Student } from '../services/students';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  Box,
  Typography,
  FormControl,
  Grid,
  Alert
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, eachDayOfInterval, addDays, isSunday, differenceInDays } from 'date-fns';

export const Attendance: React.FC = () => {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(addDays(new Date(), 6));
  const [error, setError] = useState<string>('');
  const { loading, attendanceData, fetchAttendanceRange, markAttendance } = useAttendance();
  const { students, isLoading: studentsLoading } = useStudents();

  const handleStartDateChange = (newValue: Date | null) => {
    if (newValue) {
      if (isSunday(newValue)) {
        setError('Cannot select Sunday as start date');
        return;
      }
      setError('');
      setStartDate(newValue);
      
      // Adjust end date if needed
      const daysDiff = differenceInDays(endDate, newValue);
      if (daysDiff > 6) {
        setEndDate(addDays(newValue, 6));
      } else if (daysDiff < 0) {
        setEndDate(addDays(newValue, 6));
      }
    }
  };

  const handleEndDateChange = (newValue: Date | null) => {
    if (newValue) {
      if (isSunday(newValue)) {
        setError('Cannot select Sunday as end date');
        return;
      }

      const daysDiff = differenceInDays(newValue, startDate);
      if (daysDiff > 6) {
        setError('Date range cannot exceed 7 days');
        return;
      } else if (daysDiff < 0) {
        setError('End date must be after start date');
        return;
      }

      setError('');
      setEndDate(newValue);
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      fetchAttendanceRange(
        format(startDate, 'yyyy-MM-dd'),
        format(endDate, 'yyyy-MM-dd')
      );
    }
  }, [startDate, endDate, fetchAttendanceRange]);

  const handleAttendanceChange = async (studentId: string, date: Date, status: 'present' | 'absent') => {
    await markAttendance({
      studentId,
      date: format(date, 'yyyy-MM-dd'),
      status,
    });
  };

  const getAttendanceForDate = (studentId: string, date: string) => {
    return attendanceData.find(
      (a) => a.studentId === studentId && a.date === date
    );
  };

  if (loading || studentsLoading) {
    return <LoadingSpinner />;
  }

  // Get array of dates between start and end date
  const dateRange = eachDayOfInterval({ start: startDate, end: endDate })
    .filter(date => !isSunday(date)); // Filter out Sundays

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Attendance Management
      </Typography>

      <Grid 
        container 
        spacing={2} 
        sx={{ 
          mb: 3,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Grid item xs={12} sm={5}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={handleStartDateChange}
              sx={{ width: '100%' }}
              shouldDisableDate={isSunday}
            />
          </LocalizationProvider>
        </Grid>
        <Grid 
          item 
          xs={12} 
          sm={2} 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            typography: 'body1',
            fontWeight: 'medium'
          }}
        >
          to
        </Grid>
        <Grid item xs={12} sm={5}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={handleEndDateChange}
              minDate={startDate}
              maxDate={addDays(startDate, 6)}
              sx={{ width: '100%' }}
              shouldDisableDate={isSunday}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student Name</TableCell>
              <TableCell>Email</TableCell>
              {dateRange.map((date) => (
                <TableCell key={date.toISOString()} align="center">
                  {format(date, 'dd MMM')}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{`${student.firstName} ${student.lastName}`}</TableCell>
                <TableCell>{student.email}</TableCell>
                {dateRange.map((date) => {
                  const attendance = getAttendanceForDate(
                    student.id!,
                    format(date, 'yyyy-MM-dd')
                  );
                  return (
                    <TableCell key={date.toISOString()} align="center">
                      <FormControl size="small" sx={{ minWidth: 100 }}>
                        <Select
                          value={attendance?.status || ''}
                          onChange={(e) =>
                            handleAttendanceChange(
                              student.id!,
                              date,
                              e.target.value as 'present' | 'absent'
                            )
                          }
                          displayEmpty
                        >
                          <MenuItem value="">Not marked</MenuItem>
                          <MenuItem value="present">Present</MenuItem>
                          <MenuItem value="absent">Absent</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}; 