
-- Add RLS policy to allow users to update their own deposits
CREATE POLICY "Users can update own deposits" 
  ON public.deposits 
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
