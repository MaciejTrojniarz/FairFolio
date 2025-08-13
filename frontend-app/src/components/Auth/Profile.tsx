import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Avatar,
  Switch,
  FormControlLabel,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import CryptoJS from 'crypto-js';
import { useI18n } from '../../contexts/I18nContext';
import { useThemeMode } from '../../contexts/ThemeContext';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';


const getGravatarUrl = (email: string, size: number = 120, defaultImage: string = 'identicon') => {
  const hash = CryptoJS.MD5(email.trim().toLowerCase()).toString();
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=${defaultImage}`;
};


const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { t } = useI18n();
  const { mode, toggleTheme } = useThemeMode();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (!user) {
    return (
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Typography variant="h5" component="h1" gutterBottom>
            {t('profile')}
          </Typography>
          <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
            <Typography variant="body1">{t('not_logged_in')}</Typography>
            <Button variant="contained" onClick={() => navigate('/login')} sx={{ mt: 2 }}>
              {t('go_to_login')}
            </Button>
          </Paper>
        </Box>
      </Container>
    );
  }

  const gravatarUrl = user?.email ? getGravatarUrl(user.email, 120) : undefined;

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('user_profile')}
        </Typography>

        <Paper elevation={2} sx={{ p: 3, mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {gravatarUrl && (
            <Avatar
              src={gravatarUrl}
              alt={user?.email || t('user_avatar')}
              sx={{ width: 120, height: 120, mb: 2 }}
            />
          )}
          <Typography variant="h5" component="h2" gutterBottom>
            {user.email}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
            {t('user_id')}: {user.id}
          </Typography>

          {user.created_at && (
            <Typography variant="body2" color="text.secondary">
              {t('member_since')}: {new Date(user.created_at).toLocaleDateString()}
            </Typography>
          )}
          {user.last_sign_in_at && (
            <Typography variant="body2" color="text.secondary">
              {t('last_sign_in')}: {new Date(user.last_sign_in_at).toLocaleString()}
            </Typography>
          )}

          {/* Theme Toggle */}
          <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
            {mode === 'light' ? <Brightness7Icon /> : <Brightness4Icon />}
            <FormControlLabel
              control={<Switch checked={mode === 'dark'} onChange={toggleTheme} />}
              label={mode === 'light' ? t('light_mode') : t('dark_mode')}
            />
          </Box>
        </Paper>

        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
          <Button variant="outlined" onClick={() => navigate('/')}>
            <ArrowBackIcon sx={{ mr: 1 }} /> {t('back_to_home')}
          </Button>
          <Button variant="contained" color="error" onClick={handleLogout}>
            {t('logout')}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Profile;
