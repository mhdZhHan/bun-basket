import { sql } from "..";

export const up = async () => {
  await sql`
    CREATE TABLE IF NOT EXISTS product(
	    id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      name VARCHAR(255) NOT NULL,
      image VARCHAR(255) NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      created_at timestamp DEFAULT now() NOT NULL,
      updated_at timestamp DEFAULT now() NOT NULL
    )
  `;
};

export const down = async () => {
  await sql`DROP TABLE IF EXISTS product`;
};
