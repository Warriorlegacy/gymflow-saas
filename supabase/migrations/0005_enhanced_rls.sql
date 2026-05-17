-- Enhanced Multi-Tenant Schema with Proper RLS
-- Run this after 0001_init.sql

-- 1. Add performance indexes for common queries
create index if not exists idx_members_phone on public.members(phone);
create index if not exists idx_members_email on public.members(email);
create index if not exists idx_members_status on public.members(status);
create index if not exists idx_members_gym_phone on public.members(gym_id, phone) unique;
create index if not exists idx_users_email on public.users(email);
create index if not exists idx_users_gym_email on public.users(gym_id, email) unique;
create index if not exists idx_subscriptions_member on public.subscriptions(member_id);
create index if not exists idx_subscriptions_status on public.subscriptions(billing_status);
create index if not exists idx_attendance_member_date on public.attendance(member_id, attended_on);
create index if not exists idx_payments_member on public.payments(member_id);

-- 2. Add member authentication columns
alter table public.members add column if not exists password_hash text;
alter table public.members add column if not exists is_verified boolean not null default false;
alter table public.members add column if not exists verification_code text;
alter table public.members add column if not exists verification_expires_at timestamptz;

-- 3. Add Stripe customer columns to gyms
alter table public.gyms add column if not exists stripe_customer_id text;
alter table public.gyms add column if not exists stripe_subscription_id text;
alter table public.gyms add column if not exists stripe_price_id text;

-- 4. Update current_gym_id function to handle both JWT and demo mode
create or replace function public.current_gym_id()
returns uuid as $$
  select coalesce(
    nullif(auth.jwt() ->> 'gym_id', '')::uuid,
    nullif(current_setting('app.gym_id', true), '')::uuid,
    '00000000-0000-0000-0000-000000000001'::uuid
  );
$$ language sql stable;

-- 5. Add function to get current user role
create or replace function public.current_user_role()
returns text as $$
  select coalesce(auth.jwt() ->> 'role', 'member');
$$ language sql stable;

-- 6. Add function to get current user ID
create or replace function public.current_user_id()
returns uuid as $$
  select coalesce(
    nullif(auth.jwt() ->> 'user_id', '')::uuid,
    nullif(auth.jwt() ->> 'sub', '')::uuid
  );
$$ language sql stable;

-- 7. Create member-specific views for self-service
create or replace view public.member_dashboard_view as
select 
  m.id as member_id,
  m.gym_id,
  m.full_name,
  m.phone,
  m.email,
  m.status,
  m.joined_on,
  m.primary_goal,
  s.id as subscription_id,
  s.plan_id,
  s.start_date,
  s.end_date,
  s.billing_status,
  s.amount as subscription_amount,
  p.name as plan_name,
  p.duration_days,
  (
    select count(*)::int 
    from public.attendance a 
    where a.member_id = m.id 
    and a.attended_on >= current_date - interval '30 days'
  ) as attendance_last_30_days,
  (
    select count(*)::int 
    from public.attendance a 
    where a.member_id = m.id 
    and a.attended_on = current_date
  ) as checked_in_today
from public.members m
left join public.subscriptions s on s.member_id = m.id and s.billing_status = 'active'
left join public.plans p on p.id = s.plan_id;

-- 8. Member check-in function
create or replace function public.member_check_in(p_member_id uuid)
returns jsonb as $$
declare
  v_attendance_id uuid;
  v_already_checked boolean;
  v_gym_id uuid;
begin
  select exists(
    select 1 from public.attendance 
    where member_id = p_member_id 
    and attended_on = current_date
  ) into v_already_checked;
  
  if v_already_checked then
    return jsonb_build_object(
      'success', false,
      'message', 'Already checked in today'
    );
  end if;
  
  select gym_id into v_gym_id from public.members where id = p_member_id;
  
  insert into public.attendance (gym_id, member_id, attended_on, check_in_time, source)
  values (v_gym_id, p_member_id, current_date, now(), 'mobile')
  returning id into v_attendance_id;
  
  return jsonb_build_object(
    'success', true,
    'message', 'Check-in successful',
    'attendance_id', v_attendance_id
  );
end;
$$ language plpgsql security definer;

-- 9. Improved RLS policies with role-based access
-- Drop old policies
drop policy if exists "gym scoped access on gyms" on public.gyms;
drop policy if exists "gym scoped access on users" on public.users;
drop policy if exists "gym scoped access on members" on public.members;

-- Gyms: Only owners can modify, but all can read
create policy "gym owners can update" on public.gyms
  for update using (
    gym_id = current_gym_id() 
    and current_user_role() in ('owner', 'manager')
  );

create policy "gym read access" on public.gyms
  for select using (gym_id = current_gym_id());

-- Users: Gym admins can manage, but members can read
create policy "admins can manage users" on public.users
  for all using (
    gym_id = current_gym_id() 
    and current_user_role() in ('owner', 'manager')
  );

-- Members: Gym staff can manage, members can read their own
create policy "staff can manage members" on public.members
  for all using (
    gym_id = current_gym_id() 
    and current_user_role() in ('owner', 'manager', 'trainer', 'staff')
  );

-- Plans: Gym admins can manage
create policy "admins can manage plans" on public.plans
  for all using (
    gym_id = current_gym_id() 
    and current_user_role() in ('owner', 'manager')
  );

-- Payments: Gym staff can manage
create policy "staff can manage payments" on public.payments
  for all using (
    gym_id = current_gym_id() 
    and current_user_role() in ('owner', 'manager', 'staff')
  );

-- Attendance: Members can check in, staff can view all
create policy "members can checkin" on public.attendance
  for insert with check (
    gym_id = current_gym_id()
  );

create policy "staff can view attendance" on public.attendance
  for select using (
    gym_id = current_gym_id() 
    and current_user_role() in ('owner', 'manager', 'trainer', 'staff')
  );

-- Subscriptions: Staff can manage
create policy "staff can manage subscriptions" on public.subscriptions
  for all using (
    gym_id = current_gym_id() 
    and current_user_role() in ('owner', 'manager', 'staff')
  );

-- Trainers: Staff can manage
create policy "staff can manage trainers" on public.trainers
  for all using (
    gym_id = current_gym_id() 
    and current_user_role() in ('owner', 'manager')
  );

-- Workouts: Trainers can manage
create policy "trainers can manage workouts" on public.workouts
  for all using (
    gym_id = current_gym_id() 
    and current_user_role() in ('owner', 'manager', 'trainer')
  );

-- Diet Plans: Trainers can manage
create policy "trainers can manage diet_plans" on public.diet_plans
  for all using (
    gym_id = current_gym_id() 
    and current_user_role() in ('owner', 'manager', 'trainer')
  );

-- Messages: Staff can manage
create policy "staff can manage messages" on public.messages
  for all using (
    gym_id = current_gym_id() 
    and current_user_role() in ('owner', 'manager', 'staff')
  );

-- 10. Allow anon for member self-service (check-in)
create policy "allow member checkin" on public.attendance
  for insert with check (source = 'mobile');

-- 11. Create helper function for demo mode
create or replace function public.is_demo_mode()
returns boolean as $$
begin
  return current_gym_id() = '00000000-0000-0000-0000-000000000001'::uuid;
end;
$$ language plpgsql stable;
