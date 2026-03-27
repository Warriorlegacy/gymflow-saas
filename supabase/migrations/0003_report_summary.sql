ALTER TABLE public.ai_logs DROP CONSTRAINT IF EXISTS ai_logs_feature_check;
ALTER TABLE public.ai_logs ADD CONSTRAINT ai_logs_feature_check CHECK (feature in ('chatbot', 'diet_plan', 'workout_plan', 'message_generator', 'report_summary'));
