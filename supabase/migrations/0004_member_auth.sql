-- Add member authentication columns
alter table public.members add column if not exists password_hash text;
alter table public.members add column if not exists is_verified boolean not null default false;
alter table public.members add column if not exists verification_code text;
alter table public.members add column if not exists verification_expires_at timestamptz;

-- Add indexes for member auth
create index if not exists idx_members_phone on public.members(phone);
create index if not exists idx_members_email on public.members(email);
create index if not exists idx_members_verification_code on public.members(verification_code);

-- Add member-specific attendance view
create or replace view public.member_dashboard as
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

-- Add API for member check-in
create or replace function public.member_check_in(p_member_id uuid)
returns jsonb as $$
declare
  v_attendance_id uuid;
  v_already_checked boolean;
begin
  -- Check if already checked in today
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
  
  -- Get member's gym_id
  insert into public.attendance (gym_id, member_id, attended_on, check_in_time, source)
  select gym_id, p_member_id, current_date, now(), 'mobile'
  from public.members where id = p_member_id
  returning id into v_attendance_id;
  
  return jsonb_build_object(
    'success', true,
    'message', 'Check-in successful',
    'attendance_id', v_attendance_id
  );
end;
$$ language plpgsql security definer;
