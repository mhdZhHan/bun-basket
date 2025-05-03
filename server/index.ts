import express from "express";
import helmet from "helmet";

import { logger } from "@/configs/logger";
import { errorHandler } from "@/middlewares/error-handler";
import { pinoLogger } from "@/middlewares/pino-logger";

const app = express();
const port = 8080;

// middlewares
app.use(express.json());
app.use(helmet());

app.use(pinoLogger);
app.use(errorHandler);

app.get("/", (req, res) => {
  req.log.info("Processing request to homepage");
  res.send("Hello World!");
});

app
  .listen(port, () => {
    logger.info(`Listening on port ${port}...`);
  })
  .on("error", (error) => {
    throw new Error(error.message);
  });
