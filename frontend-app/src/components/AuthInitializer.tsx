import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { supabase } from '../supabaseClient';
import { setUser, setLoading } from '../store/features/auth/authSlice';
import type { Session } from '@supabase/supabase-js';
import { useI18n } from '../contexts/useI18n';
import { useThemeMode } from '../contexts/useThemeMode';

interface AuthInitializerProps {
  children: React.ReactNode;
}

const AuthInitializer: React.FC<AuthInitializerProps> = ({ children }) => {
  const dispatch = useDispatch();
  const { setLang } = useI18n();
  const { setMode } = useThemeMode();

  useEffect(() => {
    const handleAuthChange = async (session: Session | null) => {
      if (session?.user) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('name, language, theme')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          setLang('en');
          setMode('dark');
          dispatch(setUser({ ...session.user, name: session.user.email, language: 'en', theme: 'dark' }));
        } else if (profile) {
          setLang(profile.language);
          setMode(profile.theme);
          dispatch(setUser({ ...session.user, name: profile.name, language: profile.language, theme: profile.theme }));
        } else {
          setLang('en');
          setMode('dark');
          dispatch(setUser({ ...session.user, name: session.user.email, language: 'en', theme: 'dark' }));
        }
      } else {
        setLang('en');
        setMode('dark');
        dispatch(setUser(null));
      }
      dispatch(setLoading(false));
    };

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      handleAuthChange(session);
    });

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      await handleAuthChange(session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [dispatch, setLang, setMode]);

  return <>{children}</>;
};

export default AuthInitializer;