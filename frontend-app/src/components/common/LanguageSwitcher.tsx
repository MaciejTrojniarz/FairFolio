import React from 'react';
import { Button, ButtonGroup } from '@mui/material';
import { useI18n } from '../../contexts/I18nContext';

const LanguageSwitcher: React.FC = () => {
  const { lang, setLang } = useI18n();

  return (
    <ButtonGroup variant="outlined" aria-label="language switcher">
      <Button
        onClick={() => setLang('en')}
        variant={lang === 'en' ? 'contained' : 'outlined'}
      >
        EN
      </Button>
      <Button
        onClick={() => setLang('pl')}
        variant={lang === 'pl' ? 'contained' : 'outlined'}
      >
        PL
      </Button>
    </ButtonGroup>
  );
};

export default LanguageSwitcher;
