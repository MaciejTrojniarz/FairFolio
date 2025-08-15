-- Enable Row Level Security
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Create a default policy that initially blocks all access
CREATE POLICY "Restrict access by default" ON public.events
FOR ALL TO authenticated, anon
USING (false);

-- Example policy for authenticated users
CREATE POLICY "Users can view public events" ON public.events
FOR SELECT TO authenticated
USING (is_public = true);

-- Example policy for event creators
CREATE POLICY "Users can manage their own events" ON public.events
FOR ALL TO authenticated
USING ((SELECT auth.uid()) = creator_id)
WITH CHECK ((SELECT auth.uid()) = creator_id);
