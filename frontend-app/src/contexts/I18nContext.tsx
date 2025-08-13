import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface I18nContextType {
  t: (key: string, params?: Record<string, string>) => string;
  lang: string;
  setLang: (lang: string) => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
  children: ReactNode;
  initialLang?: string;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children, initialLang = 'en' }) => {
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
      } catch (error) {
        console.error('Error loading translations:', error);
        // Fallback to English if selected language fails
        if (lang !== 'en') {
          const response = await fetch(`/src/locales/en.json`);
          const data = await response.json();
          setTranslations(data);
          setLang('en'); // Set language to English on fallback
        }
      }
    };
    fetchTranslations();
  }, [lang]);

  const t = (key: string, params?: Record<string, string>): string => {
    let translation = translations[key] || key; // Fallback to key if translation not found
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

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
