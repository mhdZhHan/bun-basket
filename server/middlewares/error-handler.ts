import type { Response, Request, NextFunction } from "express";
import { logger } from "@/configs/logger";

export function errorHandler(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  logger.error("Server Error: ", error);
  res
    .status(500)
    .json({ success: false, message: "Server Error", error: error.message });
}
