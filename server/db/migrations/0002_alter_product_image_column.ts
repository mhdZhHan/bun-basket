import { sql } from "..";

export const up = async () => {
  await sql`
    ALTER TABLE product
    ALTER COLUMN image TYPE TEXT;
  `;
};

export const down = async () => {
  await sql`
    ALTER TABLE product
    ALTER COLUMN image TYPE VARCHAR(255);
  `;
};
