import React from 'react';
import { Switch, Box, Typography } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useThemeMode } from '../../contexts/useThemeMode';
import { useI18n } from '../../contexts/useI18n';

interface ThemeSwitcherProps {
  onThemeChange?: (theme: 'light' | 'dark') => void;
  displayMode?: 'light' | 'dark';
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ onThemeChange }) => {
  const { mode, toggleTheme } = useThemeMode();
  const { t } = useI18n();

  const handleToggleTheme = () => {
    toggleTheme();
    if (onThemeChange) {
      onThemeChange(mode === 'light' ? 'dark' : 'light');
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LightModeIcon color={mode === 'light' ? 'primary' : 'inherit'} />
          <Switch
            checked={mode === 'dark'}
            onChange={handleToggleTheme}
            inputProps={{ 'aria-label': t('theme_switch') }}
          />
          <DarkModeIcon color={mode === 'dark' ? 'primary' : 'inherit'} />
          <Typography variant="body2">
            {mode === 'light' ? t('light_mode') : t('dark_mode')}
          </Typography>
    </Box>
  );
};

export default ThemeSwitcher;