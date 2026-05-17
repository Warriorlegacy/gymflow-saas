#!/usr/bin/env node

/**
 * GymFlow - Check Database Status
 */

const SUPABASE_URL = "https://jsjrspjygwbtgocojzjh.supabase.co";
const SUPABASE_SERVICE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpzanJzcGp5Z3didGdvY29qempoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDU5MDUxOCwiZXhwIjoyMDkwMTY2NTE4fQ.z_FUEPMNr3u5Ht8zbKoiD-jPJHGTfkoZTlTuFEO_VPQ";

const AUTH_HEADER = {
  apikey: SUPABASE_SERVICE_KEY,
  Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
  "Content-Type": "application/json",
};

const TABLES = [
  "gyms",
  "users",
  "members",
  "plans",
  "payments",
  "attendance",
  "subscriptions",
  "messages",
  "trainers",
  "workouts",
  "diet_plans",
  "ai_logs",
];

async function checkTable(table) {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=count`, {
      headers: AUTH_HEADER,
    });
    const data = await res.json();
    const count = data[0]?.count || 0;
    console.log(`  ✅ ${table}: ${count} rows`);
    return count;
  } catch (e) {
    console.log(`  ❌ ${table}: ${e.message}`);
    return -1;
  }
}

async function main() {
  console.log("🔍 Checking GymFlow Database Status\n");
  console.log(`Project: jsjrspjygwbtgocojzjh`);
  console.log(`URL: ${SUPABASE_URL}\n`);

  console.log("📊 Table Status:\n");

  for (const table of TABLES) {
    await checkTable(table);
  }

  console.log("\n✅ Database check complete!");
  console.log(
    "\n📝 Note: To add new columns or RLS policies, run SQL in Supabase Dashboard:",
  );
  console.log(
    "   https://supabase.com/dashboard/project/jsjrspjygwbtgocojzjh/sql-editor",
  );
}

main();
