import React from 'react';
import { Button, ButtonGroup } from '@mui/material';
import { useI18n } from '../../contexts/useI18n';

interface LanguageSwitcherProps {
  onLanguageChange?: (lang: string) => void;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ onLanguageChange }) => {
  const { lang, setLang } = useI18n();

  const handleLanguageChange = (newLang: string) => {
    setLang(newLang);
    if (onLanguageChange) {
      onLanguageChange(newLang);
    }
  };

  return (
    <ButtonGroup variant="outlined" aria-label="language switcher">
      <Button
        onClick={() => handleLanguageChange('en')}
        variant={lang === 'en' ? 'contained' : 'outlined'}
      >
        EN
      </Button>
      <Button
        onClick={() => handleLanguageChange('pl')}
        variant={lang === 'pl' ? 'contained' : 'outlined'}
      >
        PL
      </Button>
    </ButtonGroup>
  );
};

export default LanguageSwitcher;