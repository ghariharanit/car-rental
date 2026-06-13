-- Additional schema: profile email, booking profile FK, sequence helpers

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email text;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', split_part(NEW.email, '@', 1)),
    NEW.email
  );
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM anon, authenticated;

ALTER TABLE public.bookings
  ADD CONSTRAINT IF NOT EXISTS bookings_user_profile_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id);

CREATE OR REPLACE FUNCTION public.reset_cars_id_seq()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT setval('public.cars_id_seq', COALESCE((SELECT MAX(id) FROM public.cars), 1), true);
$$;

CREATE OR REPLACE FUNCTION public.reset_bookings_id_seq()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT setval('public.bookings_id_seq', COALESCE((SELECT MAX(id) FROM public.bookings), 1), true);
$$;

REVOKE ALL ON FUNCTION public.reset_cars_id_seq() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.reset_cars_id_seq() FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.reset_bookings_id_seq() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.reset_bookings_id_seq() FROM anon, authenticated;
