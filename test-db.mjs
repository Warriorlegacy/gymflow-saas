import { createClient } from "@supabase/supabase-js";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL.replace(/\\n/g, '').trim();
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY.replace(/\\n/g, '').trim();
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

async function check() {
  const { data, error } = await supabase.from("gyms").select("*").eq("slug", "peak-motion-fitness");
  console.log("Error:", error);
  console.log("Data:", data);
}
check();
