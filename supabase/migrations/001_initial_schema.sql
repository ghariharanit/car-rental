-- DriveEase initial schema: profiles, cars, bookings + RLS

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Profiles (display name linked to auth user)
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  name text NOT NULL,
  email text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "profiles_select_admin"
  ON public.profiles FOR SELECT
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

-- Cars catalog
CREATE TABLE public.cars (
  id bigserial PRIMARY KEY,
  name text NOT NULL,
  seats integer NOT NULL CHECK (seats >= 2),
  fuel text NOT NULL,
  price integer NOT NULL CHECK (price >= 1),
  available boolean NOT NULL DEFAULT true,
  images text[] NOT NULL DEFAULT '{}',
  description text NOT NULL
);

ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cars_select_public"
  ON public.cars FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "cars_insert_admin"
  ON public.cars FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "cars_update_admin"
  ON public.cars FOR UPDATE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "cars_delete_admin"
  ON public.cars FOR DELETE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Bookings
CREATE TABLE public.bookings (
  id bigserial PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  car_id bigint NOT NULL REFERENCES public.cars (id) ON DELETE RESTRICT,
  pickup_date date NOT NULL,
  return_date date NOT NULL CHECK (return_date >= pickup_date),
  total_price integer NOT NULL CHECK (total_price >= 0),
  status text NOT NULL CHECK (status IN ('confirmed', 'pending', 'completed', 'cancelled')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bookings_select_own"
  ON public.bookings FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "bookings_select_admin"
  ON public.bookings FOR SELECT
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "bookings_insert_own"
  ON public.bookings FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "bookings_update_admin"
  ON public.bookings FOR UPDATE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Auto-create profile on signup (for future sign-up; seed uses direct inserts)
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

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
