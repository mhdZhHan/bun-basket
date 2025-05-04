import express from "express";
import helmet from "helmet";

import { logger } from "@/configs/logger";
import { errorHandler } from "@/middlewares/error-handler";
import { pinoLogger } from "@/middlewares/pino-logger";
import env from "@/env";

import indexRoutes from "@/routes/index.route";
import productsRoutes from "@/routes/products.route";

const app = express();
const port = env.PORT || 8080;

// Middlewares
app.use(express.json());
app.use(helmet());
app.use(pinoLogger);

// Routes
app.use("/api", indexRoutes);
app.use("/api/products", productsRoutes);

// Error handler
app.use(errorHandler);

app
  .listen(port, () => {
    logger.info(`Listening on port ${port}...`);
  })
  .on("error", (error) => {
    logger.error(`Server failed to start: ${error.message}`);
    process.exit(1);
  });
