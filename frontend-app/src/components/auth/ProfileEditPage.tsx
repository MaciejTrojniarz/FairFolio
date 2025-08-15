import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { supabase } from '../../supabaseClient';
import { setUser } from '../../store/features/auth/authSlice';
import { showToast } from '../../store/features/ui/uiSlice';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';
import LanguageSwitcher from '../common/LanguageSwitcher';
import ThemeSwitcher from '../common/ThemeSwitcher';
import { useI18n } from '../../contexts/useI18n';
import { useThemeMode } from '../../contexts/useThemeMode';

const ProfileEditPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useI18n();
  const { setLang } = useI18n();
  const { setMode } = useThemeMode();

  const user = useSelector((state: RootState) => state.auth.user);

  const [name, setName] = useState(user?.name || '');
  const [language, setLanguage] = useState(user?.language || 'en');
  const [theme, setTheme] = useState(user?.theme || 'dark');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!user) {
      setError(t('user_not_authenticated'));
      setLoading(false);
      dispatch(showToast({ message: t('user_not_authenticated'), severity: 'error' }));
      return;
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ name, language, theme })
      .eq('id', user.id);

    if (updateError) {
      console.error('Error updating profile:', updateError);
      setError(updateError.message);
      dispatch(showToast({ message: updateError.message, severity: 'error' }));
    } else {
      setSuccess(t('profile_updated_successfully'));
        const { data: updatedProfile, error: fetchError } = await supabase
          .from('profiles')
          .select('name, language, theme')
          .eq('id', user.id)
          .single();

      if (fetchError) {
        console.error('Error re-fetching profile after update:', fetchError);
        setError(t('profile_update_refetch_error'));
        dispatch(showToast({ message: t('profile_update_refetch_error'), severity: 'warning' }));
      } else if (updatedProfile) {
        dispatch(setUser({ ...user, name: updatedProfile.name, language: updatedProfile.language, theme: updatedProfile.theme }));
        setLang(updatedProfile.language);
        setMode(updatedProfile.theme);
        navigate('/profile'); // Redirect to profile page
      }
    }
    setLoading(false);
  };

  if (!user) {
    return (
      <Container maxWidth="md">
        <Box sx={{ my: 4, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('edit_profile')}
        </Typography>

        <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
          <form onSubmit={handleSave}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

            <TextField
              label={t('name')}
              variant="outlined"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>{t('language')}:</Typography>
              <LanguageSwitcher onLanguageChange={setLanguage} />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>{t('theme')}:</Typography>
              <ThemeSwitcher onThemeChange={setTheme} />
            </Box>

            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? t('saving') : t('save_changes')}
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default ProfileEditPage;