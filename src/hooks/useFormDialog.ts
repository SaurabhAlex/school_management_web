import { useState } from 'react';

interface FormDialogState<T> {
  isOpen: boolean;
  data: T;
}

export const useFormDialog = <T>(initialData: T) => {
  const [state, setState] = useState<FormDialogState<T>>({
    isOpen: false,
    data: initialData,
  });

  const open = (data?: Partial<T>) => {
    setState({
      isOpen: true,
      data: data ? { ...initialData, ...data } : initialData,
    });
  };

  const close = () => {
    setState({
      isOpen: false,
      data: initialData,
    });
  };

  const updateData = (data: Partial<T>) => {
    setState((prev) => ({
      ...prev,
      data: { ...prev.data, ...data },
    }));
  };

  return {
    isOpen: state.isOpen,
    data: state.data,
    open,
    close,
    updateData,
  };
}; 