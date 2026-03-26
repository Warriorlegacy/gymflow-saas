create extension if not exists "pgcrypto";

create table if not exists public.gyms (
  id uuid primary key default gen_random_uuid(),
  gym_id uuid unique not null default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  owner_email text not null,
  phone text,
  address text,
  city text,
  state text,
  country text default 'India',
  timezone text default 'Asia/Calcutta',
  subscription_tier text not null default 'starter' check (subscription_tier in ('starter', 'growth', 'scale')),
  subscription_status text not null default 'trial' check (subscription_status in ('trial', 'active', 'past_due', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  gym_id uuid not null references public.gyms(gym_id) on delete cascade,
  auth_user_id uuid unique,
  full_name text not null,
  email text not null,
  phone text,
  role text not null check (role in ('owner', 'manager', 'trainer', 'staff')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  gym_id uuid not null references public.gyms(gym_id) on delete cascade,
  full_name text not null,
  email text,
  phone text not null,
  gender text,
  date_of_birth date,
  joined_on date not null default current_date,
  status text not null default 'active' check (status in ('active', 'inactive', 'expired', 'lead')),
  primary_goal text,
  notes text,
  trainer_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  gym_id uuid not null references public.gyms(gym_id) on delete cascade,
  name text not null,
  duration_days integer not null,
  price numeric(10,2) not null default 0,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  gym_id uuid not null references public.gyms(gym_id) on delete cascade,
  member_id uuid not null references public.members(id) on delete cascade,
  plan_id uuid references public.plans(id) on delete set null,
  amount numeric(10,2) not null,
  paid_on date not null default current_date,
  method text not null default 'cash' check (method in ('cash', 'upi', 'card', 'bank', 'demo')),
  status text not null default 'paid' check (status in ('paid', 'pending', 'failed', 'refunded')),
  reference_code text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.attendance (
  id uuid primary key default gen_random_uuid(),
  gym_id uuid not null references public.gyms(gym_id) on delete cascade,
  member_id uuid not null references public.members(id) on delete cascade,
  attended_on date not null default current_date,
  check_in_time timestamptz,
  source text not null default 'manual' check (source in ('manual', 'qr', 'mobile')),
  created_at timestamptz not null default now(),
  unique (gym_id, member_id, attended_on)
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  gym_id uuid not null references public.gyms(gym_id) on delete cascade,
  member_id uuid references public.members(id) on delete cascade,
  plan_id uuid references public.plans(id) on delete set null,
  start_date date not null default current_date,
  end_date date not null,
  amount numeric(10,2) not null default 0,
  billing_status text not null default 'active' check (billing_status in ('trial', 'active', 'expiring', 'expired', 'cancelled')),
  auto_renew boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  gym_id uuid not null references public.gyms(gym_id) on delete cascade,
  member_id uuid references public.members(id) on delete set null,
  channel text not null default 'whatsapp' check (channel in ('whatsapp', 'sms', 'email')),
  message_type text not null check (message_type in ('welcome', 'payment_reminder', 'expiry_reminder', 'campaign')),
  recipient text not null,
  content text not null,
  delivery_status text not null default 'queued' check (delivery_status in ('queued', 'sent', 'failed')),
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.ai_logs (
  id uuid primary key default gen_random_uuid(),
  gym_id uuid not null references public.gyms(gym_id) on delete cascade,
  requested_by uuid references public.users(id) on delete set null,
  feature text not null check (feature in ('chatbot', 'diet_plan', 'workout_plan', 'message_generator')),
  prompt text not null,
  response text,
  created_at timestamptz not null default now()
);

create table if not exists public.trainers (
  id uuid primary key default gen_random_uuid(),
  gym_id uuid not null references public.gyms(gym_id) on delete cascade,
  full_name text not null,
  email text,
  phone text,
  specialty text,
  bio text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workouts (
  id uuid primary key default gen_random_uuid(),
  gym_id uuid not null references public.gyms(gym_id) on delete cascade,
  member_id uuid references public.members(id) on delete cascade,
  trainer_id uuid references public.trainers(id) on delete set null,
  title text not null,
  goal text,
  schedule jsonb not null default '[]'::jsonb,
  ai_generated boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.diet_plans (
  id uuid primary key default gen_random_uuid(),
  gym_id uuid not null references public.gyms(gym_id) on delete cascade,
  member_id uuid references public.members(id) on delete cascade,
  trainer_id uuid references public.trainers(id) on delete set null,
  title text not null,
  objective text,
  meals jsonb not null default '[]'::jsonb,
  ai_generated boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.members
  add constraint members_trainer_id_fkey
  foreign key (trainer_id) references public.trainers(id) on delete set null;

create index if not exists idx_users_gym_id on public.users(gym_id);
create index if not exists idx_members_gym_id on public.members(gym_id);
create index if not exists idx_plans_gym_id on public.plans(gym_id);
create index if not exists idx_payments_gym_id on public.payments(gym_id);
create index if not exists idx_attendance_gym_id on public.attendance(gym_id);
create index if not exists idx_subscriptions_gym_id on public.subscriptions(gym_id);
create index if not exists idx_messages_gym_id on public.messages(gym_id);
create index if not exists idx_ai_logs_gym_id on public.ai_logs(gym_id);
create index if not exists idx_trainers_gym_id on public.trainers(gym_id);
create index if not exists idx_workouts_gym_id on public.workouts(gym_id);
create index if not exists idx_diet_plans_gym_id on public.diet_plans(gym_id);

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace function public.current_gym_id()
returns uuid as $$
  select coalesce(
    nullif(auth.jwt() ->> 'gym_id', '')::uuid,
    '00000000-0000-0000-0000-000000000001'::uuid
  );
$$ language sql stable;

create or replace function public.current_role()
returns text as $$
  select coalesce(auth.jwt() ->> 'role', 'owner');
$$ language sql stable;

drop trigger if exists set_gyms_updated_at on public.gyms;
create trigger set_gyms_updated_at before update on public.gyms for each row execute function public.handle_updated_at();
drop trigger if exists set_users_updated_at on public.users;
create trigger set_users_updated_at before update on public.users for each row execute function public.handle_updated_at();
drop trigger if exists set_members_updated_at on public.members;
create trigger set_members_updated_at before update on public.members for each row execute function public.handle_updated_at();
drop trigger if exists set_plans_updated_at on public.plans;
create trigger set_plans_updated_at before update on public.plans for each row execute function public.handle_updated_at();
drop trigger if exists set_subscriptions_updated_at on public.subscriptions;
create trigger set_subscriptions_updated_at before update on public.subscriptions for each row execute function public.handle_updated_at();
drop trigger if exists set_trainers_updated_at on public.trainers;
create trigger set_trainers_updated_at before update on public.trainers for each row execute function public.handle_updated_at();
drop trigger if exists set_workouts_updated_at on public.workouts;
create trigger set_workouts_updated_at before update on public.workouts for each row execute function public.handle_updated_at();
drop trigger if exists set_diet_plans_updated_at on public.diet_plans;
create trigger set_diet_plans_updated_at before update on public.diet_plans for each row execute function public.handle_updated_at();

alter table public.gyms enable row level security;
alter table public.users enable row level security;
alter table public.members enable row level security;
alter table public.plans enable row level security;
alter table public.payments enable row level security;
alter table public.attendance enable row level security;
alter table public.subscriptions enable row level security;
alter table public.messages enable row level security;
alter table public.ai_logs enable row level security;
alter table public.trainers enable row level security;
alter table public.workouts enable row level security;
alter table public.diet_plans enable row level security;

create policy "gym scoped access on gyms" on public.gyms
  for all using (gym_id = public.current_gym_id()) with check (gym_id = public.current_gym_id());

create policy "gym scoped access on users" on public.users
  for all using (gym_id = public.current_gym_id()) with check (gym_id = public.current_gym_id());

create policy "gym scoped access on members" on public.members
  for all using (gym_id = public.current_gym_id()) with check (gym_id = public.current_gym_id());

create policy "gym scoped access on plans" on public.plans
  for all using (gym_id = public.current_gym_id()) with check (gym_id = public.current_gym_id());

create policy "gym scoped access on payments" on public.payments
  for all using (gym_id = public.current_gym_id()) with check (gym_id = public.current_gym_id());

create policy "gym scoped access on attendance" on public.attendance
  for all using (gym_id = public.current_gym_id()) with check (gym_id = public.current_gym_id());

create policy "gym scoped access on subscriptions" on public.subscriptions
  for all using (gym_id = public.current_gym_id()) with check (gym_id = public.current_gym_id());

create policy "gym scoped access on messages" on public.messages
  for all using (gym_id = public.current_gym_id()) with check (gym_id = public.current_gym_id());

create policy "gym scoped access on ai_logs" on public.ai_logs
  for all using (gym_id = public.current_gym_id()) with check (gym_id = public.current_gym_id());

create policy "gym scoped access on trainers" on public.trainers
  for all using (gym_id = public.current_gym_id()) with check (gym_id = public.current_gym_id());

create policy "gym scoped access on workouts" on public.workouts
  for all using (gym_id = public.current_gym_id()) with check (gym_id = public.current_gym_id());

create policy "gym scoped access on diet_plans" on public.diet_plans
  for all using (gym_id = public.current_gym_id()) with check (gym_id = public.current_gym_id());

insert into public.gyms (gym_id, name, slug, owner_email, phone, address, city, state, subscription_tier, subscription_status)
values (
  '00000000-0000-0000-0000-000000000001',
  'GymFlow Demo Fitness',
  'gymflow-demo',
  'owner@gymflow.demo',
  '+919999999999',
  '12 Fitness Street',
  'Bengaluru',
  'Karnataka',
  'growth',
  'active'
)
on conflict (gym_id) do nothing;
