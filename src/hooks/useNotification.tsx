import { useState, useCallback } from 'react';
import { Snackbar, Alert } from '@mui/material';
import type { AlertColor } from '@mui/material';

interface NotificationState {
  open: boolean;
  message: string;
  severity: AlertColor;
}

export const useNotification = () => {
  const [state, setState] = useState<NotificationState>({
    open: false,
    message: '',
    severity: 'info',
  });

  const showNotification = useCallback((message: string, severity: AlertColor = 'info') => {
    setState({
      open: true,
      message,
      severity,
    });
  }, []);

  const hideNotification = useCallback(() => {
    setState((prev) => ({
      ...prev,
      open: false,
    }));
  }, []);

  const NotificationComponent = () => (
    <Snackbar
      open={state.open}
      autoHideDuration={6000}
      onClose={hideNotification}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert onClose={hideNotification} severity={state.severity} sx={{ width: '100%' }}>
        {state.message}
      </Alert>
    </Snackbar>
  );

  return {
    showNotification,
    hideNotification,
    NotificationComponent,
  };
}; 