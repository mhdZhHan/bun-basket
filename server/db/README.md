# Bun SQL Migration Helper 🚀

A lightweight, reusable script to manage database migrations for your Bun + PostgreSQL projects. Apply or rollback schema changes with ease! 🐰💾

## Features
- **Up & Down Migrations**: Run `up` to apply changes, `down` to roll back.
- **Smart Table Check**: Handles fresh databases like a pro.
- **Concurrency Safe**: Locks prevent migration clashes in production.
- **TS/JS Friendly**: Works with `.ts` or `.js` migration files.
- **Simple & Fast**: Built for Bun’s speed and simplicity.

## Usage
1. **Set Up**:
   - Place `migrate.ts` in `server/db/`.
   - Add migrations to `migrations/` (e.g., `0001_init.ts`).
   - Ensure `@/db` exports a `sql` client.

2. **Scripts** (in `package.json`):
   ```json
   {
     "scripts": {
       "sql:migrate-up": "bun run server/db/migrate.ts up",
       "sql:migrate-down": "bun run server/db/migrate.ts down"
     }
   }
   ```

3. **Run**:
   ```bash
   bun run sql:migrate-up    # Apply migrations
   bun run sql:migrate-down  # Rollback migrations
   ```

## Migration Example
```typescript
// migrations/0001_init.ts
import { sql } from "@/db";

export const up = async () => {
  await sql`CREATE TABLE fun (id SERIAL PRIMARY KEY, name VARCHAR(255))`;
};

export const down = async () => {
  await sql`DROP TABLE fun`;
};
```

## Why It’s Awesome
- **Reusable**: Drop it into any Bun + SQL project.
- **No Fuss**: Handles errors, closes connections, and keeps things tidy.
- **Tiny**: Small script, big impact.

Happy migrating! 🎉