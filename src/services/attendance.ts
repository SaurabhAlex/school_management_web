import api from './api';

export interface Attendance {
  id: string;
  studentId: string;
  date: string;
  status: 'present' | 'absent';
  notes?: string;
}

export const attendanceService = {
  // Get attendance for a specific date or date range
  getAttendance: async (date: string) => {
    const response = await api.get(`/attendance?date=${date}`);
    return response.data;
  },

  // Mark attendance for a student
  markAttendance: async (attendanceData: Omit<Attendance, 'id'>) => {
    const response = await api.post('/attendance', attendanceData);
    return response.data;
  },

  // Update attendance
  updateAttendance: async (id: string, attendanceData: Partial<Attendance>) => {
    const response = await api.put(`/attendance/${id}`, attendanceData);
    return response.data;
  },

  // Get attendance report for a student
  getStudentAttendanceReport: async (studentId: string) => {
    const response = await api.get(`/attendance/student/${studentId}`);
    return response.data;
  }
}; 