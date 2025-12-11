-- Add foreign key from properties to profiles for the join
ALTER TABLE public.properties
ADD CONSTRAINT properties_agent_id_profiles_fkey
FOREIGN KEY (agent_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Add foreign key from access_logs to profiles
ALTER TABLE public.access_logs
ADD CONSTRAINT access_logs_user_id_profiles_fkey
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE SET NULL;