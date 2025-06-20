import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { roleService, type Role, type CreateRoleData, type UpdateRoleData, type RoleResponse } from '../services/role';

export const useRole = () => {
  const queryClient = useQueryClient();

  const { data: response = { roles: [] }, isLoading } = useQuery<RoleResponse>({
    queryKey: ['roles'],
    queryFn: roleService.getRoles,
  });

  // Get roles array from response
  const roles = response.roles || [];

  const addRoleMutation = useMutation({
    mutationFn: roleService.addRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });

  const editRoleMutation = useMutation({
    mutationFn: roleService.editRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });

  const deleteRoleMutation = useMutation({
    mutationFn: roleService.deleteRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });

  const addRole = async (data: CreateRoleData) => {
    try {
      await addRoleMutation.mutateAsync(data);
    } catch (error) {
      throw error;
    }
  };

  const editRole = async (data: UpdateRoleData) => {
    try {
      await editRoleMutation.mutateAsync(data);
    } catch (error) {
      throw error;
    }
  };

  const deleteRole = async (id: string) => {
    try {
      await deleteRoleMutation.mutateAsync(id);
    } catch (error) {
      throw error;
    }
  };

  return {
    roles,
    isLoading,
    addRole,
    editRole,
    deleteRole,
  };
}; 