import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { supabase } from '../../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../contexts/useI18n';
import LanguageSwitcher from '../common/LanguageSwitcher';
import ThemeSwitcher from '../common/ThemeSwitcher';
import { useThemeMode } from '../../contexts/useThemeMode';
import { showToast } from '../../store/features/ui/uiSlice';
import { Container, Paper, Box, Typography, TextField, Button, Alert } from '@mui/material';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedTheme, setSelectedTheme] = useState<'dark' | 'light'>('dark');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, setLang } = useI18n();
  const { setMode } = useThemeMode();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
    } else {
      navigate('/');
    }
    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
    } else if (data.user) {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ name: name, language: selectedLanguage, theme: selectedTheme })
        .eq('id', data.user.id);

      if (updateError) {
        setError(t('registration_success_preferences_fail'));
        dispatch(showToast({ message: t('registration_success_preferences_fail'), severity: 'error' }));
      } else {
        setLang(selectedLanguage);
        setMode(selectedTheme);
        navigate('/');
      }
    } else {
      setError(t('registration_failed_no_user_data'));
      dispatch(showToast({ message: t('registration_failed_no_user_data'), severity: 'error' }));
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="sm" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)' }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
        <Typography variant="h5" component="h2" align="center" gutterBottom data-testid="auth-title">
          {isRegistering ? t('register') : t('login')}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={isRegistering ? handleRegister : handleLogin} data-testid="auth-form">
          <TextField
            type="email"
            id="email"
            label={t('email')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            margin="normal"
            data-testid="auth-email"
          />

          <TextField
            type="password"
            id="password"
            label={t('password')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            margin="normal"
            data-testid="auth-password"
          />

          {isRegistering && (
            <>
              <TextField
                type="text"
                id="name"
                label={t('name')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                fullWidth
                margin="normal"
              />

              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>{t('language')}</Typography>
                <LanguageSwitcher onLanguageChange={setSelectedLanguage} />
              </Box>

              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>{t('theme')}</Typography>
                <ThemeSwitcher onThemeChange={setSelectedTheme} />
              </Box>
            </>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{ mt: 3 }}
            data-testid="auth-submit"
          >
            {loading ? (isRegistering ? t('registering') : t('logging_in')) : (isRegistering ? t('register') : t('login'))}
          </Button>
        </Box>

        <Button
          onClick={() => setIsRegistering(!isRegistering)}
          variant="text"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          data-testid="toggle-register"
        >
          {isRegistering ? t('already_have_account') : t('dont_have_account')}
        </Button>
      </Paper>
    </Container>
  );
};

export default Login;