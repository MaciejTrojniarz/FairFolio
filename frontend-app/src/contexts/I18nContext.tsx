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
        const response = await fetch(`/locales/${lang}.json`);
        if (!response.ok) {
          throw new Error(`Could not load translations for ${lang}`);
        }
        const data = await response.json();
        setTranslations(data);
      } catch (error: unknown) {
        console.error('Error loading translations:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        dispatch(showToast({ message: `Error loading translations: ${errorMessage}`, severity: 'error' }));
        if (lang !== 'en') {
          try {
            const response = await fetch(`/locales/en.json`);
            if (!response.ok) {
              throw new Error('Could not load fallback English translations');
            }
            const data = await response.json();
            setTranslations(data);
            setLang('en');
          } catch (fallbackError: unknown) {
            console.error('Error loading fallback translations:', fallbackError);
            dispatch(showToast({ message: 'Failed to load any translations', severity: 'error' }));
            // Set empty translations as last resort
            setTranslations({});
          }
        }
      }
    };
    fetchTranslations();
  }, [lang, dispatch]);

  const t = (key: string, params?: Record<string, string>): string => {
    let translation = translations[key] || key;
    if (params) {
      for (const [paramKey, paramValue] of Object.entries(params)) {
        // Use global flag to replace all occurrences
        const regex = new RegExp(`\\{${paramKey}\\}`, 'g');
        translation = translation.replace(regex, paramValue);
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


