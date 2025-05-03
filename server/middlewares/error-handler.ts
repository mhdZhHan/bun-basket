import type { Response, Request, NextFunction } from "express";
import { errorResponse } from "@/lib/utils";

export function errorHandler(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(error);
  errorResponse(res, 500, error);
}
