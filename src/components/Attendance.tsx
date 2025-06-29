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
  Button,
  Select,
  MenuItem,
  TextField,
  Box,
  Typography,
  FormControl,
  InputLabel
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';

export const Attendance: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { loading, attendanceData, fetchAttendance, markAttendance } = useAttendance();
  const { students, isLoading: studentsLoading } = useStudents();

  useEffect(() => {
    if (selectedDate) {
      fetchAttendance(format(selectedDate, 'yyyy-MM-dd'));
    }
  }, [selectedDate, fetchAttendance]);

  const handleAttendanceChange = async (studentId: string, status: 'present' | 'absent') => {
    await markAttendance({
      studentId,
      date: format(selectedDate, 'yyyy-MM-dd'),
      status,
    });
  };

  if (loading || studentsLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Attendance Management
      </Typography>

      <Box sx={{ mb: 3 }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Select Date"
            value={selectedDate}
            onChange={(newValue: Date | null) => newValue && setSelectedDate(newValue)}
          />
        </LocalizationProvider>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Mobile Number</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => {
              const studentAttendance = attendanceData.find(
                (a) => a.studentId === student.id
              );

              return (
                <TableRow key={student.id}>
                  <TableCell>{`${student.firstName} ${student.lastName}`}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.mobileNumber}</TableCell>
                  <TableCell>
                    {studentAttendance?.status || 'Not marked'}
                  </TableCell>
                  <TableCell>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <InputLabel>Mark Attendance</InputLabel>
                      <Select
                        value={studentAttendance?.status || ''}
                        label="Mark Attendance"
                        onChange={(e) =>
                          handleAttendanceChange(
                            student.id!,
                            e.target.value as 'present' | 'absent'
                          )
                        }
                      >
                        <MenuItem value="present">Present</MenuItem>
                        <MenuItem value="absent">Absent</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}; 