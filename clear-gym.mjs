import { createClient } from "@supabase/supabase-js";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL.replace(/\\n/g, '').trim();
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY.replace(/\\n/g, '').trim();
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

async function clear() {
  const { error } = await supabase.from("gyms").delete().eq("slug", "peak-motion-fitness");
  console.log("Delete Error:", error || "None");
}
clear();
