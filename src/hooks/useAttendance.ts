import { useState, useCallback } from 'react';
import { attendanceService, Attendance } from '../services/attendance';
import { useNotification } from './useNotification';

export const useAttendance = () => {
  const [loading, setLoading] = useState(false);
  const [attendanceData, setAttendanceData] = useState<Attendance[]>([]);
  const { showNotification } = useNotification();

  const fetchAttendance = useCallback(async (date: string) => {
    try {
      setLoading(true);
      const data = await attendanceService.getAttendance(date);
      setAttendanceData(data);
    } catch (error) {
      showNotification('Error fetching attendance data', 'error');
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  const markAttendance = useCallback(async (attendanceData: Omit<Attendance, 'id'>) => {
    try {
      setLoading(true);
      await attendanceService.markAttendance(attendanceData);
      showNotification('Attendance marked successfully', 'success');
      // Refresh attendance data
      await fetchAttendance(attendanceData.date);
    } catch (error) {
      showNotification('Error marking attendance', 'error');
    } finally {
      setLoading(false);
    }
  }, [fetchAttendance, showNotification]);

  const updateAttendance = useCallback(async (id: string, data: Partial<Attendance>) => {
    try {
      setLoading(true);
      await attendanceService.updateAttendance(id, data);
      showNotification('Attendance updated successfully', 'success');
      // Refresh attendance data if date is available
      if (data.date) {
        await fetchAttendance(data.date);
      }
    } catch (error) {
      showNotification('Error updating attendance', 'error');
    } finally {
      setLoading(false);
    }
  }, [fetchAttendance, showNotification]);

  return {
    loading,
    attendanceData,
    fetchAttendance,
    markAttendance,
    updateAttendance
  };
}; 