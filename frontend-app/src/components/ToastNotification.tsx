import React, { type SyntheticEvent } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { hideToast } from '../store/features/ui/uiSlice';

const ToastNotification: React.FC = () => {
  const dispatch = useDispatch();
  const { open, message, severity } = useSelector((state: RootState) => state.ui.toast);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleClose = (event?: Event | SyntheticEvent<any, Event>) => {
    if (event?.type === 'clickaway') {
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