import { sql } from "..";

export const up = async () => {
  await sql`
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
};

export const down = async () => {
  await sql`DROP TABLE IF EXISTS migrations`;
};
