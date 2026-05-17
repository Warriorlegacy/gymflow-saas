-- Performance optimization migration: Add composite indexes for common query patterns

-- Members: gym_id + status for filtering active members
CREATE INDEX IF NOT EXISTS idx_members_gym_status ON public.members(gym_id, status);

-- Members: gym_id + joined_on for ordering
CREATE INDEX IF NOT EXISTS idx_members_gym_joined ON public.members(gym_id, joined_on DESC);

-- Members: phone for login lookups (already unique but explicit index)
CREATE INDEX IF NOT EXISTS idx_members_phone ON public.members(phone);

-- Payments: gym_id + paid_on for date-based queries
CREATE INDEX IF NOT EXISTS idx_payments_gym_paid ON public.payments(gym_id, paid_on DESC);

-- Payments: gym_id + status for filtering paid payments
CREATE INDEX IF NOT EXISTS idx_payments_gym_status ON public.payments(gym_id, status);

-- Attendance: gym_id + attended_on for date-based queries
CREATE INDEX IF NOT EXISTS idx_attendance_gym_date ON public.attendance(gym_id, attended_on);

-- Attendance: member_id + attended_on for member attendance history
CREATE INDEX IF NOT EXISTS idx_attendance_member_date ON public.attendance(member_id, attended_on);

-- Subscriptions: gym_id + billing_status for filtering active subscriptions
CREATE INDEX IF NOT EXISTS idx_subscriptions_gym_status ON public.subscriptions(gym_id, billing_status);

-- Subscriptions: gym_id + end_date for expiry queries
CREATE INDEX IF NOT EXISTS idx_subscriptions_gym_end ON public.subscriptions(gym_id, end_date);

-- Subscriptions: member_id + billing_status for member subscription lookup
CREATE INDEX IF NOT EXISTS idx_subscriptions_member_status ON public.subscriptions(member_id, billing_status);

-- Trainers: gym_id + is_active for filtering active trainers
CREATE INDEX IF NOT EXISTS idx_trainers_gym_active ON public.trainers(gym_id, is_active);

-- Plans: gym_id + is_active for filtering active plans
CREATE INDEX IF NOT EXISTS idx_plans_gym_active ON public.plans(gym_id, is_active);

-- Workouts: gym_id + created_at for ordering
CREATE INDEX IF NOT EXISTS idx_workouts_gym_created ON public.workouts(gym_id, created_at DESC);

-- Diet plans: gym_id + created_at for ordering
CREATE INDEX IF NOT EXISTS idx_diet_plans_gym_created ON public.diet_plans(gym_id, created_at DESC);

-- Gyms: slug for gym lookup
CREATE INDEX IF NOT EXISTS idx_gyms_slug ON public.gyms(slug);

-- Users: email for login
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- Analyze tables to update statistics for query planner
ANALYZE public.members;
ANALYZE public.payments;
ANALYZE public.attendance;
ANALYZE public.subscriptions;
ANALYZE public.trainers;
ANALYZE public.plans;
ANALYZE public.workouts;
ANALYZE public.diet_plans;
