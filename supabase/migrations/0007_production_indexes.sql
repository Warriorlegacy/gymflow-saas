-- Performance indexes for production
-- Composite indexes for common query patterns

-- Members: gym_id + status (dashboard active count), gym_id + joined_on (recent members)
CREATE INDEX IF NOT EXISTS idx_members_gym_status ON public.members(gym_id, status);
CREATE INDEX IF NOT EXISTS idx_members_gym_joined ON public.members(gym_id, joined_on DESC);
CREATE INDEX IF NOT EXISTS idx_members_phone ON public.members(phone);
CREATE INDEX IF NOT EXISTS idx_members_trainer ON public.members(trainer_id) WHERE trainer_id IS NOT NULL;

-- Payments: gym_id + paid_on (recent payments), gym_id + status
CREATE INDEX IF NOT EXISTS idx_payments_gym_paid ON public.payments(gym_id, paid_on DESC);
CREATE INDEX IF NOT EXISTS idx_payments_gym_member ON public.payments(gym_id, member_id);
CREATE INDEX IF NOT EXISTS idx_payments_member ON public.payments(member_id);

-- Attendance: gym_id + attended_on (daily attendance), member_id + attended_on (member history)
CREATE INDEX IF NOT EXISTS idx_attendance_gym_date ON public.attendance(gym_id, attended_on DESC);
CREATE INDEX IF NOT EXISTS idx_attendance_member_date ON public.attendance(member_id, attended_on DESC);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON public.attendance(attended_on);

-- Subscriptions: gym_id + billing_status (active subscriptions), gym_id + end_date (expiring)
CREATE INDEX IF NOT EXISTS idx_subscriptions_gym_status ON public.subscriptions(gym_id, billing_status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_gym_end ON public.subscriptions(gym_id, end_date);
CREATE INDEX IF NOT EXISTS idx_subscriptions_member ON public.subscriptions(member_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_active ON public.subscriptions(gym_id, billing_status, end_date) WHERE billing_status = 'active';

-- Users: email lookup (login), gym_id + role
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_gym_role ON public.users(gym_id, role);
CREATE INDEX IF NOT EXISTS idx_users_auth ON public.users(auth_user_id) WHERE auth_user_id IS NOT NULL;

-- Gyms: slug (lookup by slug)
CREATE INDEX IF NOT EXISTS idx_gyms_slug ON public.gyms(slug);
CREATE INDEX IF NOT EXISTS idx_gyms_owner_email ON public.gyms(owner_email);

-- Trainers: gym_id + is_active
CREATE INDEX IF NOT EXISTS idx_trainers_gym_active ON public.trainers(gym_id, is_active) WHERE is_active = true;

-- Plans: gym_id + is_active
CREATE INDEX IF NOT EXISTS idx_plans_gym_active ON public.plans(gym_id, is_active) WHERE is_active = true;

-- Workouts: gym_id + created_at
CREATE INDEX IF NOT EXISTS idx_workouts_gym_created ON public.workouts(gym_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_workouts_member ON public.workouts(member_id) WHERE member_id IS NOT NULL;

-- Diet plans: gym_id + created_at
CREATE INDEX IF NOT EXISTS idx_diet_plans_gym_created ON public.diet_plans(gym_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_diet_plans_member ON public.diet_plans(member_id) WHERE member_id IS NOT NULL;

-- Messages: gym_id + created_at
CREATE INDEX IF NOT EXISTS idx_messages_gym_created ON public.messages(gym_id, created_at DESC);

-- AI logs: gym_id + created_at
CREATE INDEX IF NOT EXISTS idx_ai_logs_gym_created ON public.ai_logs(gym_id, created_at DESC);

-- Update table statistics for query planner
ANALYZE public.gyms;
ANALYZE public.users;
ANALYZE public.members;
ANALYZE public.plans;
ANALYZE public.payments;
ANALYZE public.attendance;
ANALYZE public.subscriptions;
ANALYZE public.trainers;
ANALYZE public.workouts;
ANALYZE public.diet_plans;
ANALYZE public.messages;
ANALYZE public.ai_logs;
