import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentsService, type Student, type CreateStudentData, type UpdateStudentData } from '../services/students';

export const useStudents = () => {
  const queryClient = useQueryClient();

  const { data: studentsRaw = [], isLoading } = useQuery({
    queryKey: ['students'],
    queryFn: studentsService.getStudents,
  });

  // Normalize students to always be an array
  const students = Array.isArray(studentsRaw)
    ? studentsRaw
    : studentsRaw
    ? [studentsRaw]
    : [];

  const addStudentMutation = useMutation({
    mutationFn: studentsService.addStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });

  const editStudentMutation = useMutation({
    mutationFn: studentsService.editStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });

  const deleteStudentMutation = useMutation({
    mutationFn: studentsService.deleteStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });

  const addStudent = async (data: CreateStudentData) => {
    try {
      await addStudentMutation.mutateAsync(data);
    } catch (error) {
      throw error;
    }
  };

  const editStudent = async (data: UpdateStudentData) => {
    try {
      await editStudentMutation.mutateAsync(data);
    } catch (error) {
      throw error;
    }
  };

  const deleteStudent = async (id: string) => {
    try {
      await deleteStudentMutation.mutateAsync(id);
    } catch (error) {
      throw error;
    }
  };

  return {
    students,
    isLoading,
    addStudent,
    editStudent,
    deleteStudent,
  };
}; 