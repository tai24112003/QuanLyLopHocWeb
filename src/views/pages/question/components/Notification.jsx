import React, { useState } from 'react';
import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

const useNotification = () => {
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' // 'success' | 'error' | 'warning' | 'info'
  });

  const showNotification = (message, severity = 'success') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotification({
      ...notification,
      open: false
    });
  };

  const NotificationComponent = React.memo(() => (
    <Snackbar
      open={notification.open}
      autoHideDuration={2000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <MuiAlert onClose={handleClose} severity={notification.severity} sx={{ width: '100%' }}>
        {notification.message}
      </MuiAlert>
    </Snackbar>
  ));

  return {
    showNotification,
    NotificationComponent
  };
};

export default useNotification;
