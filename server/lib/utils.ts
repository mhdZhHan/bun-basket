import type { Response } from "express";

type SuccessResponseBody<T> = {
  success: true;
  message: string;
  data?: T;
};

type ErrorResponseBody = {
  success: false;
  message: string;
  errors?: any;
};

export function successResponse<T>(
  res: Response,
  options?: { data?: T; status?: number; message?: string }
): void {
  res.status(options?.status || 200).json({
    success: true,
    message: options?.message || "Success",
    ...(options?.data && { data: options.data }),
  } as SuccessResponseBody<T>);
}

export function errorResponse(
  res: Response,
  status: number,
  message: string,
  errors?: any
): void {
  res
    .status(status)
    .json({ success: false, message, errors } as ErrorResponseBody);
}
