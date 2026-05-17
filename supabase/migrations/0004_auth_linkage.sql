-- Link public.users to auth.users based on email when an auth user is created or signs in
create or replace function public.handle_auth_user_link()
returns trigger as $$
begin
  update public.users
  set auth_user_id = new.id
  where email = new.email
  and auth_user_id is null;
  return new;
end;
$$ language plpgsql security priviledged;

-- Trigger on auth.users (requires manual setup usually, or we use a public function checked by the app)
-- Since we can't easily create triggers on auth.users via migrations in some setups, 
-- we can instead update the handle_auth_user_link to be called by a trigger on public.users? No.
-- Standard Supabase pattern:
-- CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_auth_user_link();

-- Custom Access Token Hook to inject gym_id and role into JWT
create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb as $$
declare
  claims jsonb;
  user_record record;
begin
  -- Fetch the user record from public.users to get gym_id and role
  select gym_id, role into user_record
  from public.users
  where auth_user_id = (event->>'user_id')::uuid;

  claims := event->'claims';

  if user_record.gym_id is not null then
    claims := jsonb_set(claims, '{gym_id}', to_jsonb(user_record.gym_id));
    claims := jsonb_set(claims, '{role}', to_jsonb(user_record.role));
  end if;

  return jsonb_set(event, '{claims}', claims);
end;
$$ language plpgsql stable security definer;

-- Note: To enable the hook, the user must run:
-- grant usage on schema public to supabase_auth_admin;
-- grant execute on function public.custom_access_token_hook to supabase_auth_admin;
-- alter function public.custom_access_token_hook owner to supabase_auth_admin;
-- And configure it in the Supabase Dashboard under Auth -> Hooks.
