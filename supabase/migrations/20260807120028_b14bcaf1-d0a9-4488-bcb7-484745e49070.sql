CREATE TABLE public.audits (
  id text PRIMARY KEY,
  url text NOT NULL,
  hostname text NOT NULL,
  title text NOT NULL DEFAULT '',
  overall_score integer NOT NULL DEFAULT 0,
  categories jsonb NOT NULL DEFAULT '[]'::jsonb,
  report jsonb NOT NULL,
  ai_powered boolean NOT NULL DEFAULT false,
  hidden boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX audits_created_at_idx ON public.audits (created_at DESC);
CREATE INDEX audits_hostname_idx ON public.audits (hostname);

GRANT SELECT ON public.audits TO anon;
GRANT SELECT ON public.audits TO authenticated;
GRANT UPDATE, DELETE ON public.audits TO authenticated;
GRANT ALL ON public.audits TO service_role;

ALTER TABLE public.audits ENABLE ROW LEVEL SECURITY;

CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Anyone can view visible audits"
ON public.audits FOR SELECT TO anon, authenticated
USING (hidden = false);

CREATE POLICY "Admins can view all audits"
ON public.audits FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update audits"
ON public.audits FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete audits"
ON public.audits FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));