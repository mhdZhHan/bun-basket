import fs from "fs/promises";
import path from "path";
import { sql } from "@/db";
import env from "@/env";

const MIGRATIONS_DIR = path.join(__dirname, "./migrations");
const MIGRATIONS_TABLE = env.MIGRATIONS_TABLE || "migrations";

// 🐰 Grab the migration lock to keep others out!
async function acquireLock() {
  const result = await sql`SELECT pg_try_advisory_lock(12345) AS acquired`;
  if (!result[0].acquired) {
    throw new Error("Failed to acquire migration lock");
  }
}

// 🎉 Free the lock so others can party!
async function releaseLock() {
  await sql`SELECT pg_advisory_unlock(12345)`;
}

async function ensureMigrationsTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS ${sql(MIGRATIONS_TABLE)} (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
}

async function runMigration(file: string, direction: "up" | "down") {
  const migration = await import(path.join(MIGRATIONS_DIR, file));
  if (typeof migration[direction] !== "function") {
    throw new Error(`Migration ${file} lacks a valid ${direction} function`);
  }
  console.log(`Running ${direction} for ${file}...`);
  await migration[direction]();
  if (direction === "up") {
    await sql`INSERT INTO ${sql(MIGRATIONS_TABLE)} (name) VALUES (${file})`;
  } else {
    await sql`DELETE FROM ${sql(MIGRATIONS_TABLE)} WHERE name = ${file}`;
  }
  console.log(`Completed ${direction} for ${file}`);
}

async function migrate(direction: "up" | "down") {
  await acquireLock();
  try {
    await ensureMigrationsTable();
    const files = (await fs.readdir(MIGRATIONS_DIR))
      .filter((f) => f.endsWith(".ts") || f.endsWith(".js"))
      .sort();

    const executedMigrations = await sql`
      SELECT name FROM ${sql(MIGRATIONS_TABLE)} ORDER BY name
    `.then((res) => res.map((r: any) => r.name));

    for (const file of files) {
      if (
        (direction === "up" && !executedMigrations.includes(file)) ||
        (direction === "down" && executedMigrations.includes(file))
      ) {
        await runMigration(file, direction);
      }
    }
  } finally {
    await releaseLock();
  }
}

async function main() {
  const direction = process.argv[2] as "up" | "down" | undefined;
  if (!["up", "down"].includes(direction || "")) {
    console.error("Usage: bun run migrate.ts <up|down>");
    process.exit(1);
  }

  try {
    if (!env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not set");
    }
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
