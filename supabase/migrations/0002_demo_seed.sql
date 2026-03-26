insert into public.trainers (id, gym_id, full_name, email, phone, specialty, bio, is_active)
values
  ('30000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Neha Verma', 'neha@gymflow.demo', '+91 90000 00001', 'Strength & conditioning', 'Focuses on strength cycles and onboarding assessments.', true),
  ('30000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Rohan Das', 'rohan@gymflow.demo', '+91 90000 00002', 'Fat loss and nutrition', 'Runs body recomposition and sustainable meal plans.', true)
on conflict (id) do nothing;

insert into public.plans (id, gym_id, name, duration_days, price, description, is_active)
values
  ('40000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Monthly', 30, 1499, 'Flexible monthly membership', true),
  ('40000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Quarterly', 90, 3999, 'Best for habit building', true),
  ('40000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Annual', 365, 14999, 'Highest retention and loyalty', true)
on conflict (id) do nothing;

insert into public.members (id, gym_id, full_name, email, phone, gender, joined_on, status, primary_goal, trainer_id)
values
  ('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Priya Nair', 'priya@example.com', '+91 98765 43210', 'Female', '2026-01-15', 'active', 'Weight loss', '30000000-0000-0000-0000-000000000002'),
  ('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Rahul Mehta', 'rahul@example.com', '+91 98765 43211', 'Male', '2026-02-11', 'active', 'Muscle gain', '30000000-0000-0000-0000-000000000001'),
  ('20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Isha Rao', null, '+91 98765 43212', 'Female', '2026-03-01', 'lead', 'Postpartum fitness', null)
on conflict (id) do nothing;

insert into public.payments (id, gym_id, member_id, plan_id, amount, paid_on, method, status, reference_code)
values
  ('50000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000002', 3999, '2026-03-05', 'upi', 'paid', 'UPI-3934'),
  ('50000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000001', 1499, '2026-03-20', 'cash', 'pending', 'CASH-104')
on conflict (id) do nothing;

insert into public.subscriptions (id, gym_id, member_id, plan_id, start_date, end_date, amount, billing_status, auto_renew)
values
  ('70000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000002', '2026-03-05', '2026-06-03', 3999, 'active', false),
  ('70000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000001', '2026-03-20', '2026-04-19', 1499, 'expiring', false)
on conflict (id) do nothing;

insert into public.attendance (id, gym_id, member_id, attended_on, check_in_time, source)
values
  ('60000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '2026-03-25', '2026-03-25T06:35:00.000Z', 'mobile'),
  ('60000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002', '2026-03-25', '2026-03-25T18:10:00.000Z', 'manual')
on conflict (gym_id, member_id, attended_on) do nothing;
