import React, { useState } from 'react';
import { IconButton, Menu, MenuItem, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { supabase } from '../../supabaseClient';
import GravatarAvatar from '../common/GravatarAvatar';
import { useI18n } from '../../contexts/useI18n';
import { useNavigate } from 'react-router-dom';

const UserMenu: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { t } = useI18n();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [infoOpen, setInfoOpen] = useState(false);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenInfo = () => {
    setInfoOpen(true);
  };

  const handleCloseInfo = () => {
    setInfoOpen(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    handleClose();
    navigate('/login');
  };

  const handleProfile = () => {
    handleClose();
    navigate('/profile');
  };

  const handleLogin = () => {
    handleClose();
    navigate('/login');
  };

  return (
    <Box sx={{ flexGrow: 0 }}>
      {user ? (
        <>
          <IconButton
            size="large"
            aria-label={t('user_profile')}
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <GravatarAvatar email={user?.email} size={40} />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={open}
            onClose={handleClose}
          >
            <MenuItem onClick={handleOpenInfo}>
              {t('app_name')} — v{import.meta.env.VITE_APP_VERSION}
            </MenuItem>
            <MenuItem onClick={handleProfile}>
              <SettingsIcon sx={{ mr: 1 }} /> {t('profile')}
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              {t('logout')}
            </MenuItem>
          </Menu>

          <Dialog open={infoOpen} onClose={handleCloseInfo} aria-labelledby="app-info-title">
            <DialogTitle id="app-info-title">{t('app_name')}</DialogTitle>
            <DialogContent dividers>
              <Typography variant="body2">Version: v{import.meta.env.VITE_APP_VERSION}</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseInfo}>{t('close') || 'Close'}</Button>
            </DialogActions>
          </Dialog>
        </>
      ) : (
        <Button color="inherit" onClick={handleLogin}>
          {t('login')}
        </Button>
      )}
    </Box>
  );
};

export default UserMenu;