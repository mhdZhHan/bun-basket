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
