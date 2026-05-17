-- =====================================================
-- GYMFLOW MEMBER AUTH MIGRATION
-- Run this in Supabase SQL Editor
-- =====================================================

-- Add member authentication columns
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS password_hash text;
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS is_verified boolean NOT NULL DEFAULT false;
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS verification_code text;
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS verification_expires_at timestamptz;

-- Add indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_members_phone ON public.members(phone);
CREATE INDEX IF NOT EXISTS idx_members_email ON public.members(email);

-- Add Stripe columns to gyms
ALTER TABLE public.gyms ADD COLUMN IF NOT EXISTS stripe_customer_id text;
ALTER TABLE public.gyms ADD COLUMN IF NOT EXISTS stripe_subscription_id text;
ALTER TABLE public.gyms ADD COLUMN IF NOT EXISTS stripe_price_id text;

-- Create member check-in function
CREATE OR REPLACE FUNCTION public.member_check_in(p_member_id uuid)
RETURNS jsonb AS $$
DECLARE
  v_attendance_id uuid;
  v_already_checked boolean;
  v_gym_id uuid;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM public.attendance 
    WHERE member_id = p_member_id 
    AND attended_on = current_date
  ) INTO v_already_checked;
  
  IF v_already_checked THEN
    RETURN jsonb_build_object('success', false, 'message', 'Already checked in today');
  END IF;
  
  SELECT gym_id INTO v_gym_id FROM public.members WHERE id = p_member_id;
  
  INSERT INTO public.attendance (gym_id, member_id, attended_on, check_in_time, source)
  VALUES (v_gym_id, p_member_id, current_date, now(), 'mobile')
  RETURNING id INTO v_attendance_id;
  
  RETURN jsonb_build_object('success', true, 'message', 'Check-in successful', 'attendance_id', v_attendance_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create member dashboard view
CREATE OR REPLACE VIEW public.member_dashboard_view AS
SELECT 
  m.id AS member_id,
  m.gym_id,
  m.full_name,
  m.phone,
  m.email,
  m.status,
  m.joined_on,
  m.primary_goal,
  s.id AS subscription_id,
  s.plan_id,
  s.start_date,
  s.end_date,
  s.billing_status,
  s.amount AS subscription_amount,
  p.name AS plan_name,
  p.duration_days,
  (
    SELECT count(*)::int FROM public.attendance a 
    WHERE a.member_id = m.id AND a.attended_on >= current_date - interval '30 days'
  ) AS attendance_last_30_days,
  (
    SELECT count(*)::int FROM public.attendance a 
    WHERE a.member_id = m.id AND a.attended_on = current_date
  ) AS checked_in_today
FROM public.members m
LEFT JOIN public.subscriptions s ON s.member_id = m.id AND s.billing_status = 'active'
LEFT JOIN public.plans p ON p.id = s.plan_id;

-- =====================================================
-- DONE!
-- =====================================================
