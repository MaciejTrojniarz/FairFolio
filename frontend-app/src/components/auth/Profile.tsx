import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import CryptoJS from 'crypto-js';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';


import type { RootState } from '../../store';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Avatar,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { useI18n } from '../../contexts/useI18n';
import type { Profile as UserProfileType } from '../../types';

const getGravatarUrl = (email: string, size: number = 120, defaultImage: string = 'identicon') => {
  const hash = CryptoJS.MD5(email.trim().toLowerCase()).toString();
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=${defaultImage}`;
};

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { t } = useI18n();
  const [profile, setProfile] = useState<UserProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, name, language, theme')
          .eq('id', user.id)
          .single();

        if (error) {
          throw error;
        }
        setProfile(data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

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

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Typography variant="h5" component="h1" color="error" gutterBottom>
            {t('error_fetching_profile')}
          </Typography>
          <Typography variant="body1" color="error">
            {error}
          </Typography>
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
            {profile?.name}
          </Typography>
          <Typography variant="h5" component="h3" gutterBottom>
            {user.email}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
            {t('user_id')}: {user.id}
          </Typography>

          { profile?.language && (
            <Typography variant="body2" color="text.secondary">
              {t('language')}: {profile.language}
            </Typography>
          )}
          { profile?.theme && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {profile.theme === 'light' ? <LightModeIcon color={'primary'} /> : <DarkModeIcon color={'primary'}/>}
                  <Typography variant="body2">
                    {profile.theme === 'light' ? t('light_mode') : t('dark_mode')}
                  </Typography>
            </Box>
          )
          }

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
        </Paper>

        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
          <Button variant="outlined" onClick={() => navigate('/')}>
            <ArrowBackIcon sx={{ mr: 1 }} /> {t('back_to_home')}
          </Button>
          <Button variant="contained" onClick={() => navigate('/profile/edit')} sx={{ mr: 1 }}>
            {t('edit_profile')}
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
