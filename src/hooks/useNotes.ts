import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notesService, type Note, type CreateNoteData, type UpdateNoteData } from '../services/notes';

export const useNotes = () => {
  const queryClient = useQueryClient();

  const { data: notes = [], isLoading } = useQuery({
    queryKey: ['notes'],
    queryFn: notesService.getNotes,
  });

  const createNoteMutation = useMutation({
    mutationFn: notesService.createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const updateNoteMutation = useMutation({
    mutationFn: notesService.updateNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: notesService.deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const createNote = async (data: CreateNoteData) => {
    try {
      await createNoteMutation.mutateAsync(data);
    } catch (error) {
      throw error;
    }
  };

  const updateNote = async (data: UpdateNoteData) => {
    try {
      await updateNoteMutation.mutateAsync(data);
    } catch (error) {
      throw error;
    }
  };

  const deleteNote = async (id: string) => {
    try {
      await deleteNoteMutation.mutateAsync(id);
    } catch (error) {
      throw error;
    }
  };

  return {
    notes,
    isLoading,
    createNote,
    updateNote,
    deleteNote,
  };
}; 