import React, { useState } from 'react';
import { IconButton, Menu, MenuItem, Button, Box } from '@mui/material';
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

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
            <MenuItem onClick={handleProfile}>
              <SettingsIcon sx={{ mr: 1 }} /> {t('profile')}
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              {t('logout')}
            </MenuItem>
          </Menu>
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