import { SQL } from "bun";
import env from "@/env";

export const sql = new SQL({
  url: env.DATABASE_URL,

  max: 20,
  idleTimeout: 30,
  maxLifetime: 0,
  connectionTimeout: 30,

  tls: true,

  onconnect: (client) => console.log("Connected to database"),
  onclose: (client) => console.log("Connection closed"),
});

process.on("SIGTERM", async () => {
  await sql.close();
  process.exit(0);
});
