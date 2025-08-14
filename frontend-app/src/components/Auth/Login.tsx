import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { supabase } from '../../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../contexts/useI18n';
import LanguageSwitcher from '../common/LanguageSwitcher';
import ThemeSwitcher from '../common/ThemeSwitcher';
import { useThemeMode } from '../../contexts/useThemeMode';
import { showToast } from '../../store/features/ui/uiSlice';

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
  const { t } = useI18n();
  const { setLang } = useI18n();
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
    <div className="login-container">
      <h2>{isRegistering ? t('register') : t('login')}</h2>
      <form onSubmit={isRegistering ? handleRegister : handleLogin}>
        {error && <p className="error-message">{error}</p>}
        <div>
          <label htmlFor="email">{t('email')}:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">{t('password')}:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {isRegistering && (
          <>
            <div>
              <label htmlFor="name">{t('name')}:</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div style={{ marginTop: '15px' }}>
              <label>{t('language')}:</label>
              <LanguageSwitcher onLanguageChange={setSelectedLanguage} />
            </div>
            <div style={{ marginTop: '15px' }}>
              <label>{t('theme')}:</label>
              <ThemeSwitcher onThemeChange={setSelectedTheme} />
            </div>
          </>
        )}
        <button type="submit" disabled={loading}>
          {loading ? (isRegistering ? t('registering') : t('logging_in')) : (isRegistering ? t('register') : t('login'))}
        </button>
      </form>
      <button
        onClick={() => setIsRegistering(!isRegistering)}
        style={{ marginTop: '10px', background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}
      >
        {isRegistering ? t('already_have_account') : t('dont_have_account')}
      </button>
    </div>
  );
};

export default Login;