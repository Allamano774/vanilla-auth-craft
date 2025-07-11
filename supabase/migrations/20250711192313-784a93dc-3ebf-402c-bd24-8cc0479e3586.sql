
-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('user', 'admin');

-- Add role column to profiles table
ALTER TABLE public.profiles ADD COLUMN role public.app_role NOT NULL DEFAULT 'user';

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = _user_id AND role = _role
  )
$$;

-- Update admin_notifications RLS policy to allow admin access
DROP POLICY IF EXISTS "Admin notifications policy" ON public.admin_notifications;
CREATE POLICY "Admin notifications select policy" ON public.admin_notifications
  FOR SELECT 
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin notifications insert policy" ON public.admin_notifications
  FOR INSERT 
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin notifications update policy" ON public.admin_notifications
  FOR UPDATE 
  USING (public.has_role(auth.uid(), 'admin'));

-- Add UPDATE policy for orders (admin only)
CREATE POLICY "Admin can update orders" ON public.orders
  FOR UPDATE 
  USING (public.has_role(auth.uid(), 'admin'));

-- Update deposits policies to be more secure
CREATE POLICY "Admin can view all deposits" ON public.deposits
  FOR SELECT 
  USING (public.has_role(auth.uid(), 'admin') OR auth.uid() = user_id);
