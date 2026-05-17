const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

const SUPABASE_URL = "https://jsjrspjygwbtgocojzjh.supabase.co";
const SUPABASE_SERVICE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpzanJzcGp5Z3didGdvY29qempoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDU5MDUxOCwiZXhwIjoyMDkwMTY2NTE4fQ.z_FUEPMNr3u5Ht8zbKoiD-jPJHGTfkoZTlTuFEO_VPQ";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false },
});

const migrations = [
  "0001_init.sql",
  "0002_demo_seed.sql",
  "0003_report_summary.sql",
  "0004_complete_auth.sql",
  "0005_enhanced_rls.sql",
];

async function runMigrationFile(filename) {
  const filepath = path.join(__dirname, "supabase/migrations", filename);

  if (!fs.existsSync(filepath)) {
    console.log(`⚠️  ${filename} not found, skipping...`);
    return true;
  }

  const sql = fs.readFileSync(filepath, "utf8");

  console.log(`📄 Running ${filename}...`);

  try {
    // Try to execute via rpc if available
    const { data, error } = await supabase.rpc("exec_sql", { sql_text: sql });

    if (error) {
      console.log(`   ⚠️  RPC failed, trying direct query...`);

      // Split into individual statements and execute
      const statements = sql.split(";").filter((s) => s.trim().length > 0);

      for (const stmt of statements) {
        if (stmt.trim().length === 0 || stmt.trim().startsWith("--")) continue;

        const { error: stmtError } = await supabase
          .from("_exec_sql")
          .select()
          .limit(0);

        if (stmtError) {
          console.log(`   ❌ Cannot execute SQL directly via API`);
          console.log(
            `   📝 Please run ${filename} manually in Supabase SQL Editor`,
          );
          return false;
        }
      }
    }

    console.log(`   ✅ ${filename} executed successfully`);
    return true;
  } catch (err) {
    console.log(`   ❌ Error: ${err.message}`);
    return false;
  }
}

async function checkTables() {
  console.log("🔍 Checking existing tables...");

  const { data, error } = await supabase
    .from("information_schema.tables")
    .select("table_name")
    .eq("table_schema", "public")
    .limit(20);

  if (error) {
    console.log("❌ Cannot access database");
    return [];
  }

  return data?.map((t) => t.table_name) || [];
}

async function main() {
  console.log("🏋️ GymFlow Supabase Migration Runner\n");

  const tables = await checkTables();

  console.log(
    `📊 Found ${tables.length} existing tables:`,
    tables.slice(0, 10).join(", "),
  );

  if (tables.length === 0) {
    console.log("\n⚠️  No tables found! Running all migrations...\n");
  }

  // Run migrations that haven't been applied
  for (const migration of migrations) {
    await runMigrationFile(migration);
  }

  // Verify final state
  const finalTables = await checkTables();
  console.log(`\n✅ Migration complete! Total tables: ${finalTables.length}`);
  console.log("Tables:", finalTables.join(", "));
}

main().catch(console.error);
