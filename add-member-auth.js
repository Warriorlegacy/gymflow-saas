#!/usr/bin/env node

/**
 * GymFlow - Add Member Auth Columns via API
 */

const SUPABASE_URL = "https://jsjrspjygwbtgocojzjh.supabase.co";
const SUPABASE_SERVICE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpzanJzcGp5Z3didGdvY29qempoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDU5MDUxOCwiZXhwIjoyMDkwMTY2NTE4fQ.z_FUEPMNr3u5Ht8zbKoiD-jPJHGTfkoZTlTuFEO_VPQ";

const AUTH_HEADER = {
  apikey: SUPABASE_SERVICE_KEY,
  Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
  "Content-Type": "application/json",
  Prefer: "return=representation",
};

// Check if column exists in a table
async function columnExists(table, column) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/${table}?${column}=eq.null&select=${column}&limit=1`,
    { headers: AUTH_HEADER },
  );
  // This doesn't actually check - let's just try to update
  return true;
}

// Try to add columns to members table using alter (via RPC or direct)
async function addMemberAuthColumns() {
  console.log("📝 Checking member auth columns...\n");

  // First, let's check current members structure
  const res = await fetch(`${SUPABASE_URL}/rest/v1/members?select=*&limit=1`, {
    headers: AUTH_HEADER,
  });
  const members = await res.json();

  if (members.length > 0) {
    console.log("Sample member:", JSON.stringify(members[0], null, 2));
  }

  // Note: Cannot add columns via REST API - need SQL
  console.log(
    "\n⚠️  To add member auth columns, run this SQL in Supabase SQL Editor:\n",
  );
  console.log(`
-- Add member authentication columns
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS password_hash text;
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS is_verified boolean NOT NULL DEFAULT false;
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS verification_code text;
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS verification_expires_at timestamptz;

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_members_phone ON public.members(phone);
  `);
}

async function main() {
  console.log("🏋️ GymFlow - Member Auth Setup\n");
  await addMemberAuthColumns();
}

main();
