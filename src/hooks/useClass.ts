import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { classService, type CreateClassData, type UpdateClassData, type ClassResponse } from '../services/class';

export const useClass = () => {
  const queryClient = useQueryClient();

  const { data: response = { classes: [] }, isLoading } = useQuery<ClassResponse>({
    queryKey: ['classes'],
    queryFn: classService.getClasses,
  });

  // Get classes array from response
  const classes = response.classes || [];

  const addClassMutation = useMutation({
    mutationFn: classService.addClass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    },
  });

  const editClassMutation = useMutation({
    mutationFn: classService.editClass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    },
  });

  const deleteClassMutation = useMutation({
    mutationFn: classService.deleteClass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    },
  });

  const addClass = async (data: CreateClassData) => {
    try {
      await addClassMutation.mutateAsync(data);
    } catch (error) {
      throw error;
    }
  };

  const editClass = async (data: UpdateClassData) => {
    try {
      await editClassMutation.mutateAsync(data);
    } catch (error) {
      throw error;
    }
  };

  const deleteClass = async (id: string) => {
    try {
      await deleteClassMutation.mutateAsync(id);
    } catch (error) {
      throw error;
    }
  };

  return {
    classes,
    isLoading,
    addClass,
    editClass,
    deleteClass,
  };
}; 