CREATE OR REPLACE FUNCTION public.handle_new_user_with_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, language, theme)
  VALUES (NEW.id, NEW.email, 'en', 'dark'); -- Default name to email, will be updated by frontend
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created_with_profile ON auth.users;
CREATE TRIGGER on_auth_user_created_with_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_with_profile();