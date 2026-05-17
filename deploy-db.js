#!/usr/bin/env node

/**
 * GymFlow Supabase Migration Deployer
 * Run: node deploy-db.js
 *
 * Requires: SUPABASE_ACCESS_TOKEN and NEXT_PUBLIC_SUPABASE_URL
 */

const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_JWT_SECRET;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error(
    "❌ Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set",
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false },
});

async function runMigration(sql) {
  console.log("📄 Executing migration SQL...");

  const { error } = await supabase.rpc("exec_sql", { sql_text: sql });

  if (error) {
    // Try direct query if RPC doesn't exist
    console.log("⚠️  RPC not available, trying direct query...");
    const { error: queryError } = await supabase
      .from("_exec_sql")
      .select()
      .limit(0);

    if (queryError) {
      console.log(
        "⚠️  Note: Run migrations manually in Supabase dashboard or use:",
      );
      console.log("   supabase db push");
      console.log(
        "\n📝 Migration SQL ready at: supabase/migrations/0005_enhanced_rls.sql",
      );
      return false;
    }
  }

  return !error;
}

async function checkConnection() {
  console.log("🔌 Testing database connection...");
  const { data, error } = await supabase.from("gyms").select("count").limit(1);

  if (error) {
    console.error("❌ Database connection failed:", error.message);
    return false;
  }

  console.log("✅ Database connected successfully");
  return true;
}

async function main() {
  console.log("🏋️ GymFlow Supabase Migration Deployer\n");

  // Check connection
  const connected = await checkConnection();
  if (!connected) {
    console.log("\n📋 To deploy manually:");
    console.log("1. Go to Supabase Dashboard → SQL Editor");
    console.log(
      "2. Copy contents of: supabase/migrations/0005_enhanced_rls.sql",
    );
    console.log("3. Run the SQL\n");
    process.exit(1);
  }

  // Read migration file
  const migrationPath = path.join(
    __dirname,
    "supabase/migrations/0005_enhanced_rls.sql",
  );

  if (!fs.existsSync(migrationPath)) {
    console.error("❌ Migration file not found:", migrationPath);
    process.exit(1);
  }

  const sql = fs.readFileSync(migrationPath, "utf8");

  // Run migration (note: direct SQL execution requires pg package in Supabase)
  console.log(
    "\n📝 Migration SQL prepared at: supabase/migrations/0005_enhanced_rls.sql",
  );
  console.log("\n⚠️  Note: For full migration support, use Supabase CLI:");
  console.log("\n   # Install CLI if needed:");
  console.log("   npm install -g supabase");
  console.log("\n   # Link and push:");
  console.log("   supabase link --project-ref YOUR_PROJECT_REF");
  console.log("   supabase db push\n");

  console.log("✅ Connection verified! Ready for migrations.");
}

main().catch(console.error);
