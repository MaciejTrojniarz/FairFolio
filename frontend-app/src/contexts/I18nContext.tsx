import React, { createContext, useState, useEffect, type ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import { showToast } from '../store/features/ui/uiSlice';

interface I18nContextType {
  t: (key: string, params?: Record<string, string>) => string;
  lang: string;
  setLang: (lang: string) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
  children: ReactNode;
  initialLang?: string;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children, initialLang = 'en' }) => {
  const dispatch = useDispatch();
  const [lang, setLang] = useState(initialLang);
  const [translations, setTranslations] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const response = await fetch(`/src/locales/${lang}.json`);
        if (!response.ok) {
          throw new Error(`Could not load translations for ${lang}`);
        }
        const data = await response.json();
        setTranslations(data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error('Error loading translations:', error);
        dispatch(showToast({ message: `Error loading translations: ${error.message}`, severity: 'error' }));
        if (lang !== 'en') {
          const response = await fetch(`/src/locales/en.json`);
          const data = await response.json();
          setTranslations(data);
          setLang('en');
        }
      }
    };
    fetchTranslations();
  }, [lang, dispatch]);

  const t = (key: string, params?: Record<string, string>): string => {
    let translation = translations[key] || key;
    if (params) {
      for (const [paramKey, paramValue] of Object.entries(params)) {
        translation = translation.replace(`{${paramKey}}`, paramValue);
      }
    }
    return translation;
  };

  return (
    <I18nContext.Provider value={{ t, lang, setLang }}>
      {children}
    </I18nContext.Provider>
  );
};


