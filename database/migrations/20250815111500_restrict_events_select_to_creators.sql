-- Remove policy allowing authenticated users to view public events
DROP POLICY IF EXISTS "Users can view public events" ON public.events;

-- Ensure only creators can view/manage their own events
DROP POLICY IF EXISTS "Users can manage their own events" ON public.events;
CREATE POLICY "Users can manage their own events" ON public.events
FOR ALL TO authenticated
USING ((SELECT auth.uid()) = creator_id)
WITH CHECK ((SELECT auth.uid()) = creator_id);
