import env from "@/env";
import { neon } from "@neondatabase/serverless";

export const sql = neon(
  `postgresql://${env.PGUSER}:${env.PGPASSWORD}@${env.PGHOST}/${env.PGDATABASE}?sslmode=require`
);
