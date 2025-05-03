import { sql } from "@/db";
import fs from "fs/promises";
import path from "path";

const MIGRATIONS_DIR = path.join(__dirname, "./migrations");

async function runMigration(file: string, direction: "up" | "down") {
  const migration = await import(path.join(MIGRATIONS_DIR, file));
  console.log(`Running ${direction} for ${file}...`);
  await migration[direction]();
  if (direction === "up") {
    await sql`INSERT INTO migrations (name) VALUES (${file})`;
  } else {
    await sql`DELETE FROM migrations WHERE name = ${file}`;
  }
  console.log(`Completed ${direction} for ${file}`);
}

async function migrate(direction: "up" | "down") {
  const files = (await fs.readdir(MIGRATIONS_DIR))
    .filter((f) => f.endsWith(".ts"))
    .sort();

  // Check if migrations table exists
  const tableExists = await sql`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_name = 'migrations'
    ) AS table_exists
  `.then((res) => res[0].table_exists);

  // If table doesn't exist and direction is down, skip
  if (!tableExists && direction === "down") {
    console.log("No migrations table found, nothing to roll back.");
    return;
  }

  // Get executed migrations only if table exists
  const executedMigrations = tableExists
    ? await sql`SELECT name FROM migrations ORDER BY name`.then((res) =>
        res.map((r: any) => r.name)
      )
    : [];

  for (const file of files) {
    if (
      (direction === "up" && !executedMigrations.includes(file)) ||
      (direction === "down" && executedMigrations.includes(file))
    ) {
      await runMigration(file, direction);
    }
  }
}

async function main() {
  const direction = process.argv[2] as "up" | "down" | undefined;
  if (!["up", "down"].includes(direction || "")) {
    console.error("Usage: bun run migrate.ts <up|down>");
    process.exit(1);
  }

  try {
    await migrate(direction!);
    console.log(`${direction} migrations completed successfully`);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  } finally {
    await sql.close();
  }
}

main();
