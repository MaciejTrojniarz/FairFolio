import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { hideToast } from '../store/features/ui/uiSlice';

const ToastNotification: React.FC = () => {
  const dispatch = useDispatch();
  const { open, message, severity } = useSelector((state: RootState) => state.ui.toast);

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(hideToast());
  };

  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default ToastNotification;