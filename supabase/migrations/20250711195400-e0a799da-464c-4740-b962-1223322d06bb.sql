
-- Remove the admin policies
DROP POLICY IF EXISTS "Admin can view all deposits" ON public.deposits;
DROP POLICY IF EXISTS "Admin can update orders" ON public.orders;
DROP POLICY IF EXISTS "Admin notifications update policy" ON public.admin_notifications;
DROP POLICY IF EXISTS "Admin notifications insert policy" ON public.admin_notifications;
DROP POLICY IF EXISTS "Admin notifications select policy" ON public.admin_notifications;

-- Recreate original policies (if they existed)
CREATE POLICY "Users can view own deposits" ON public.deposits
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own deposits" ON public.deposits
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own deposits" ON public.deposits
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Drop the role-checking function
DROP FUNCTION IF EXISTS public.has_role(_user_id uuid, _role public.app_role);

-- Remove role column from profiles table
ALTER TABLE public.profiles DROP COLUMN IF EXISTS role;

-- Drop the app_role enum type
DROP TYPE IF EXISTS public.app_role;
