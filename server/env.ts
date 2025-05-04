import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.string().default("development"),
  LOG_LEVEL: z.enum([
    "fatal",
    "error",
    "warn",
    "info",
    "debug",
    "trace",
    "silent",
  ]),
  PORT: z.preprocess((val) => Number(val), z.number().positive().default(8080)),
  // database
  MIGRATIONS_TABLE: z.string().default("migrations"),
  DATABASE_URL: z.string(),

  PGHOST: z.string(),
  PGDATABASE: z.string(),
  PGUSER: z.string(),
  PGPASSWORD: z.string(),

  // arcjet
  ARCJET_KEY: z.string(),
  ARCJET_ENV: z.string(),
});

const processEnv = EnvSchema.safeParse(process.env);

if (!processEnv.success) {
  console.error("❌ Invalid environment variables:");
  console.error(
    JSON.stringify(processEnv.error.flatten().fieldErrors, null, 2)
  );
  process.exit(1);
}

const env = processEnv.data;

export default env;
export type Env = z.infer<typeof EnvSchema>;
