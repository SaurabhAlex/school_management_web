import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { facultyService, type Faculty, type CreateFacultyData, type UpdateFacultyData, type FacultyResponse } from '../services/faculty';

interface EditFacultyParams {
  facultyId: string;
  data: UpdateFacultyData;
}

export const useFaculty = () => {
  const queryClient = useQueryClient();

  const { data: response, isLoading } = useQuery<FacultyResponse>({
    queryKey: ['faculty'],
    queryFn: facultyService.getFaculty,
  });

  // Ensure faculty is always an array, even if response is undefined
  const faculty = Array.isArray(response?.faculty) ? response.faculty : [];

  const addFacultyMutation = useMutation({
    mutationFn: facultyService.addFaculty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faculty'] });
    },
  });

  const editFacultyMutation = useMutation({
    mutationFn: (params: EditFacultyParams) => 
      facultyService.editFaculty(params.facultyId, params.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faculty'] });
    },
  });

  const deleteFacultyMutation = useMutation({
    mutationFn: facultyService.deleteFaculty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faculty'] });
    },
  });

  const addFaculty = async (data: CreateFacultyData) => {
    try {
      await addFacultyMutation.mutateAsync(data);
    } catch (error) {
      throw error;
    }
  };

  const editFaculty = async (facultyId: string, data: UpdateFacultyData) => {
    try {
      await editFacultyMutation.mutateAsync({ facultyId, data });
    } catch (error) {
      throw error;
    }
  };

  const deleteFaculty = async (facultyId: string) => {
    try {
      await deleteFacultyMutation.mutateAsync(facultyId);
    } catch (error) {
      throw error;
    }
  };

  return {
    faculty,
    isLoading,
    addFaculty,
    editFaculty,
    deleteFaculty,
  };
}; 