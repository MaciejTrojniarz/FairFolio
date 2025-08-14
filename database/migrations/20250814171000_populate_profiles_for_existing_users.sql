INSERT INTO public.profiles (id, name, language, theme)
SELECT
  au.id,
  au.email, -- Use email as default name
  'en',
  'dark'
FROM
  auth.users AS au
LEFT JOIN
  public.profiles AS p
ON
  au.id = p.id
WHERE
  p.id IS NULL;